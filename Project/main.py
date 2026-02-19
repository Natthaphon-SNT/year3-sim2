import os
import re
import sys
import json
import asyncio
import uvicorn
import pandas as pd
import numpy as np
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.orm import sessionmaker, Session, declarative_base
from datetime import datetime
from google import genai
from playwright.async_api import async_playwright

# ==========================================
# 0. THE ULTIMATE WINDOWS ASYNCIO FIX
# ==========================================
if sys.platform == "win32" and sys.version_info < (3, 16):
    try:
        import uvicorn.loops.asyncio
        uvicorn.loops.asyncio.asyncio_setup = lambda *args, **kwargs: None
        print("🔧 Patched Uvicorn: Successfully prevented event loop override.")
    except ImportError:
        pass

# ==========================================
# 1. SETUP & CONFIG
# ==========================================
GOOGLE_API_KEY = "AIzaSyCM0JytjA14KeOu--VgXCUtJPKPU3ju-4I"
MODEL_NAME = 'gemini-2.5-pro' 

try:
    client = genai.Client(api_key=GOOGLE_API_KEY)
    print(f"✅ AI System Ready: Connected to {MODEL_NAME}")
except Exception as e:
    print(f"❌ AI Setup Error: {e}")

app = FastAPI(title="Agentic PC Recommender API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./pc_builds.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class BuildHistory(Base):
    __tablename__ = "build_history"
    id = Column(Integer, primary_key=True, index=True)
    user_input = Column(String)
    budget = Column(Integer)
    usage_type = Column(String)
    ai_advice = Column(Text) 
    total_price = Column(Integer)
    parts_json = Column(Text)
    created_at = Column(DateTime, default=datetime.now)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

# ==========================================
# 2. DATA LOADING (Baseline Catalog)
# ==========================================
HARDWARE_DF = None
if os.path.exists("hardware_updated.csv"):
    try:
        df = pd.read_csv("hardware_updated.csv")
        df.columns = df.columns.str.strip()
        cols = ['price_jib', 'price_advice', 'price_ihavecpu']
        df['price'] = df[cols].replace(0, np.nan).min(axis=1).fillna(0).astype(int)
        HARDWARE_DF = df
        print(f"✅ Loaded {len(df)} hardware items as baseline catalog.")
    except Exception as e:
        print(f"❌ CSV Error: {e}")

# ==========================================
# 3. AGENTIC TOOLS (Scraping & AI)
# ==========================================
async def call_gemini(prompt: str, retries: int = 3) -> str:
    for attempt in range(retries):
        try:
            await asyncio.sleep(2)
            response = client.models.generate_content(model=MODEL_NAME, contents=prompt)
            return response.text
        except Exception as e:
            error_msg = str(e)
            if "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg:
                wait_time = (attempt + 1) * 6  
                print(f"⚠️ Quota Hit. Retrying in {wait_time}s... (Attempt {attempt + 1}/{retries})")
                await asyncio.sleep(wait_time)
            else:
                print(f"⚠️ AI Error: {error_msg}")
                return ""
    return ""

def clean_keyword(keyword: str) -> str:
    kw = keyword
    kw = re.sub(r'\(.*?\)', '', kw) 
    kw = kw.replace("NVIDIA ", "").replace("AMD ", "").replace("Intel ", "")
    kw = re.sub(r'\s+', ' ', kw) 
    return kw.strip()

async def fetch_live_prices_for_all(parts: list) -> list:
    print("🚀 [Agent] Launching Headless Browser (Playwright)...")
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0"
        )
        
        sem = asyncio.Semaphore(5)

        async def scrape_task(part_index, store, part_name, baseline_price):
            search_kw = clean_keyword(part_name)
            price = 0
            async with sem:
                page = await context.new_page()
                try:
                    await page.route("**/*", lambda route: route.abort() 
                        if route.request.resource_type in ["image", "media", "font", "stylesheet"] 
                        else route.continue_()
                    )
                    
                    if store == "advice":
                        await page.goto(f"https://www.advice.co.th/search?keyword={search_kw.replace(' ', '+')}", timeout=15000, wait_until="domcontentloaded")
                        selectors = ['.product-grid .price-normal', '.product-grid .price', '.product-list .price']
                    elif store == "jib":
                        await page.goto(f"https://www.jib.co.th/web/product/product_search/0?str_search={search_kw.replace(' ', '%20')}", timeout=15000, wait_until="domcontentloaded")
                        selectors = ['.box_product .price_total', '.box_product .cart-price']
                    elif store == "ihavecpu":
                        await page.goto(f"https://www.ihavecpu.com/search?keyword={search_kw.replace(' ', '%20')}", timeout=15000, wait_until="domcontentloaded")
                        selectors = ['.product-item .product-price', '.product-item .price']
                    
                    for sel in selectors:
                        try:
                            await page.wait_for_selector(sel, timeout=3000)
                            elements = await page.query_selector_all(sel)
                            
                            if elements:
                                for el in elements[:3]:
                                    price_text = await el.inner_text()
                                    nums = re.sub(r'[^\d]', '', price_text)
                                    raw_price = int(nums) if nums else 0
                                    
                                    if raw_price > 0:
                                        # 🌟 [ไฮไลท์สำคัญ] เชื่อราคาหน้าร้านเป็นหลัก!
                                        # ถ่างกรอบให้กว้างสุดๆ: ถูกกว่าเดิม 90% ก็เอา แพงกว่าเดิม 4 เท่าก็เอา
                                        # กรอบนี้เอาไว้กันแค่พวก "คอมประกอบทั้งเซ็ต 200,000 บาท" ที่หลุดเข้ามาเท่านั้น
                                        lower_bound = baseline_price * 0.1 
                                        upper_bound = baseline_price * 4.0 
                                        
                                        if lower_bound <= raw_price <= upper_bound:
                                            price = raw_price
                                            print(f"✅ [{store.upper()}] เจอหน้าร้าน: {search_kw} -> {price} THB")
                                            break 
                                        else:
                                            print(f"👀 [Debug] [{store.upper()}] ข้ามราคา {raw_price} THB ของ {search_kw} (อาจเป็นคอมทั้งเครื่อง)")
                                
                                if price > 0:
                                    break
                        except Exception:
                            continue 
                    
                except Exception:
                    pass 
                finally:
                    await page.close()
            return part_index, store, price

        tasks = []
        for i, part in enumerate(parts):
            baseline_price = part['price']
            for store in ["advice", "jib", "ihavecpu"]:
                tasks.append(scrape_task(i, store, part['name'], baseline_price))
        
        results = await asyncio.gather(*tasks)
        await browser.close()
        
        # อัปเดตราคารายร้าน
        for i, store, price in results:
            if price > 0:
                parts[i]['shop_prices'][store] = price
                
        # 🌟 สรุปราคาที่ดีที่สุด (เชื่อหน้าร้านก่อน ถ้าไม่มีจริงๆ ใช้ฐานข้อมูล)
        for part in parts:
            valid_prices = [p for p in part['shop_prices'].values() if p > 0]
            
            if valid_prices:
                part['price'] = min(valid_prices) # ยึดราคาหน้าร้านที่ถูกที่สุด
            else:
                # ถ้าหาหน้าร้านไม่เจอเลยซักร้าน ให้ดึงราคาจากไฟล์ CSV มาใช้แทน
                part['price'] = part.get('price', 0)
                print(f"🔄 [Fallback] ฐานข้อมูล: หาหน้าร้านไม่เจอเลย ใช้ราคาเดิมของ {part['name']} -> {part['price']} THB")
            
        return parts

# ==========================================
# 4. API ENDPOINT (Main Logic)
# ==========================================
class UserRequest(BaseModel):
    user_input: str

@app.post("/api/analyze-requirement")
async def analyze_requirement(req: UserRequest, db: Session = Depends(get_db)):
    if HARDWARE_DF is None:
        raise HTTPException(status_code=500, detail="Hardware Database not loaded")

    try:
        # STEP 1: AI Intent Extraction
        intent_prompt = f"""
        You are an expert PC builder AI. Analyze this user request: '{req.user_input}'.
        Return ONLY a valid JSON object. Do not use Markdown like ```json.
        {{
            "budget": <integer, default 25000>,
            "usage_category": "<Gaming|Work|Streaming|AI_Render>"
        }}
        """
        ai_intent_raw = await call_gemini(intent_prompt)
        
        budget = 25000
        usage = 'Gaming'
        
        if ai_intent_raw:
            try:
                clean_json = re.sub(r'```json\n|\n```|```', '', ai_intent_raw).strip()
                json_match = re.search(r'\{.*\}', clean_json, re.DOTALL)
                if json_match:
                    intent_data = json.loads(json_match.group(0))
                    budget = intent_data.get('budget', 25000)
                    usage = intent_data.get('usage_category', 'Gaming')
            except Exception as e:
                print(f"⚠️ JSON Parse Warning: {e} -> Fallback to defaults")
        
        # STEP 2: Algorithmic Drafting 🌟 (เพิ่ม Compatibility Check แก้ไข 'name' เป็น 'model' แล้ว)
        if usage == 'Gaming':
            alloc = {'CPU': 0.20, 'GPU': 0.45, 'Mainboard': 0.12, 'RAM': 0.10, 'SSD': 0.05, 'PSU': 0.05, 'Case': 0.03}
        else:
            alloc = {'CPU': 0.30, 'GPU': 0.25, 'Mainboard': 0.15, 'RAM': 0.15, 'SSD': 0.08, 'PSU': 0.05, 'Case': 0.02}

        draft_parts = []
        cpu_brand = ""
        is_ddr4 = False
        
        build_order = ['CPU', 'Mainboard', 'RAM', 'GPU', 'SSD', 'PSU', 'Case']
        
        for cat in build_order:
            weight = alloc.get(cat, 0.1)
            candidates = HARDWARE_DF[HARDWARE_DF['category'] == cat].copy()
            
            if cat == "Mainboard":
                if cpu_brand == "Intel":
                    candidates = candidates[candidates['model'].str.contains('H610|B760|Z790|H770|Z890|B860', na=False, case=False)]
                elif cpu_brand == "AMD":
                    candidates = candidates[candidates['model'].str.contains('A620|B650|X670|B840|B850|X870', na=False, case=False)]
            
            elif cat == "RAM":
                if is_ddr4:
                    candidates = candidates[candidates['model'].str.contains('DDR4', na=False, case=False)]
                else:
                    candidates = candidates[candidates['model'].str.contains('DDR5', na=False, case=False)]

            if not candidates.empty:
                target = budget * weight
                candidates['diff'] = abs(candidates['price'] - target)
                best = candidates.sort_values('diff').iloc[0]
                
                if cat == "CPU":
                    if "Intel" in str(best['brand']) or "Intel" in str(best['model']):
                        cpu_brand = "Intel"
                    else:
                        cpu_brand = "AMD"
                elif cat == "Mainboard":
                    if "DDR4" in str(best['model']).upper():
                        is_ddr4 = True
                    else:
                        is_ddr4 = False
                
                draft_parts.append({
                    "category": cat,
                    "name": f"{best['brand']} {best['model']}",
                    "price": int(best['price']),
                    "shop_prices": {
                        "advice": int(best['price_advice']),
                        "jib": int(best['price_jib']),
                        "ihavecpu": int(best['price_ihavecpu'])
                    }
                })

        # STEP 3: Live Price Scraping
        print("🔍 Scanning live prices from stores with Headless Browser...")
        final_parts = await fetch_live_prices_for_all(draft_parts)
        total_price = sum(p['price'] for p in final_parts)

        # STEP 4: Agentic Analysis
        parts_list_str = ", ".join([f"{p['category']}: {p['name']} ({p['price']} THB)" for p in final_parts])
        
        analysis_prompt = f"""
        You are a highly skilled Thai PC Hardware Expert. 
        Analyze this final selected PC build for a user who wants it for '{req.user_input}' (Budget: {budget} THB).
        
        Build List: {parts_list_str}
        Total Price: {total_price} THB
        
        CRITICAL RULES FOR YOUR RESPONSE:
        1. DO NOT use any HTML tags.
        2. DO NOT write long paragraphs. Keep it short, punchy, and easy to read.
        3. Respond EXACTLY with the 4 headings below, and provide 1-3 bullet points under each heading.
        
        🎯 ภาพรวมความเหมาะสม:
        - 
        🚀 ประสิทธิภาพที่คาดหวัง:
        - 
        ⚠️ จุดเด่น & ข้อควรระวัง:
        - 
        💡 คำแนะนำการอัปเกรด:
        - 
        """
        
        print("🧠 Generating Expert Analysis...")
        ai_advice_raw = await call_gemini(analysis_prompt)
        
        if not ai_advice_raw:
            ai_advice_list = ["🎯 ภาพรวมความเหมาะสม:", "- ระบบไม่สามารถวิเคราะห์ได้เนื่องจากโควตา AI เต็มชั่วคราว แต่สเปกนี้ถูกจัดสรรตามงบประมาณเรียบร้อยแล้ว"]
        else:
            ai_advice_list = [line.strip() for line in ai_advice_raw.split('\n') if line.strip()]

        # STEP 5: Save & Response
        new_rec = BuildHistory(
            user_input=req.user_input, 
            budget=budget, 
            usage_type=usage,
            ai_advice=json.dumps(ai_advice_list, ensure_ascii=False), 
            total_price=total_price, 
            parts_json=json.dumps(final_parts)
        )
        db.add(new_rec)
        db.commit()

        return {
            "status": "success",
            "data": {
                "budget": budget,
                "usage": usage,
                "parts": final_parts,
                "total_price": total_price,
                "advice": ai_advice_list 
            }
        }

    except Exception as e:
        print(f"❌ Server Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Server on http://127.0.0.1:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)