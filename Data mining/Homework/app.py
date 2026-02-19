import streamlit as st
import pandas as pd
import numpy as np
import json
import os
import plotly.express as px # เพิ่มไลบรารีสำหรับทำกราฟ 3 มิติ

st.set_page_config(page_title="Car NN Predictor", layout="wide")
st.title("🚗 Car Transmission Predictor (From Scratch)")
st.markdown("โปรแกรมจำแนกประเภทเกียร์รถยนต์ โดยเขียน **Neural Network ขึ้นมาเอง (ไม่ใช้ ML Library)** และสร้าง UI ด้วย Streamlit")

# ==========================================
# 1. คลาส Neural Network (เขียนเองจากศูนย์)
# ==========================================
class SimpleNN:
    def __init__(self, input_size, hidden_size, output_size, activation):
        self.input_size = input_size
        self.hidden_size = hidden_size
        self.output_size = output_size
        self.activation = activation
        
        self.W1 = np.random.randn(input_size, hidden_size) * 0.1
        self.b1 = np.zeros((1, hidden_size))
        self.W2 = np.random.randn(hidden_size, output_size) * 0.1
        self.b2 = np.zeros((1, output_size))
        
    def act_func(self, x, derivative=False):
        if self.activation == 'relu':
            if derivative: return np.where(x > 0, 1, 0)
            return np.maximum(0, x)
        elif self.activation == 'sigmoid':
            sig = 1 / (1 + np.exp(-np.clip(x, -500, 500)))
            if derivative: return sig * (1 - sig)
            return sig
        elif self.activation == 'tanh':
            if derivative: return 1 - np.tanh(x)**2
            return np.tanh(x)

    def forward(self, X):
        self.z1 = np.dot(X, self.W1) + self.b1
        self.a1 = self.act_func(self.z1)
        self.z2 = np.dot(self.a1, self.W2) + self.b2
        self.a2 = 1 / (1 + np.exp(-np.clip(self.z2, -500, 500)))
        return self.a2

    def backward(self, X, y, learning_rate):
        m = X.shape[0]
        y = y.reshape(-1, 1)
        
        dz2 = self.a2 - y
        dW2 = (1 / m) * np.dot(self.a1.T, dz2)
        db2 = (1 / m) * np.sum(dz2, axis=0, keepdims=True)
        
        dz1 = np.dot(dz2, self.W2.T) * self.act_func(self.z1, derivative=True)
        dW1 = (1 / m) * np.dot(X.T, dz1)
        db1 = (1 / m) * np.sum(dz1, axis=0, keepdims=True)
        
        self.W1 -= learning_rate * dW1
        self.b1 -= learning_rate * db1
        self.W2 -= learning_rate * dW2
        self.b2 -= learning_rate * db2

# ==========================================
# 2. โหลดและเตรียมข้อมูล (แก้ปัญหา File Not Found)
# ==========================================
@st.cache_data
def load_data():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(current_dir, 'CAR DETAILS FROM CAR DEKHO.csv')
    
    df = pd.read_csv(file_path)
    df = df.dropna(subset=['year', 'selling_price', 'km_driven', 'transmission', 'fuel', 'seller_type', 'owner'])
    df['target'] = df['transmission'].apply(lambda x: 1 if x == 'Automatic' else 0)
    return df

df = load_data()

st.header("1. กระบวนการเตรียมข้อมูลและการกระจายตัวของข้อมูล")
st.write("ตารางแสดงข้อมูลดิบ (แปลง Automatic=1, Manual=0 เพื่อใช้เป็น Target):")
st.dataframe(df[['year', 'selling_price', 'km_driven', 'transmission', 'target', 'fuel', 'seller_type', 'owner']].head(5000))

# ==========================================
# ส่วนกราฟ 3D หมุนได้ (Auto-Rotation)
# ==========================================
st.subheader("📊 การกระจายตัวของข้อมูล (3D Animation)")
st.write("กดปุ่ม **Play** ▶️ เพื่อให้กราฟหมุนโชว์ความสัมพันธ์ของข้อมูลทั้ง 3 แกน")

import plotly.graph_objects as go

# 1. สร้างกราฟพื้นฐาน
fig = px.scatter_3d(
    df, x='year', y='selling_price', z='km_driven',
    color='transmission',
    color_discrete_map={'Automatic': '#EF553B', 'Manual': '#636EFA'},
    opacity=0.8,
    hover_data=['year', 'selling_price'],
    title="Car Data 3D Visualization"
)

# 2. คำนวณเส้นทางให้กล้องหมุนรอบแกน Z (เป็นวงกลม)
x_eye = -1.5
y_eye = -1.5
z_eye = 0.5
frames = []
n_frames = 60  # จำนวนเฟรม (ยิ่งเยอะยิ่งเนียน)

for t in np.linspace(0, 6.28, n_frames): # 0 ถึง 2*pi
    # สูตรตรีโกณมิติให้หมุนเป็นวงกลม
    x = 1.5 * np.cos(t) 
    y = 1.5 * np.sin(t)
    frames.append(go.Frame(layout=dict(scene=dict(camera=dict(eye=dict(x=x, y=y, z=z_eye))))))

fig.frames = frames

# 3. เพิ่มปุ่ม Play / Pause
fig.update_layout(
    updatemenus=[dict(
        type='buttons',
        showactive=False,
        y=0.1, x=0.9, xanchor='right', yanchor='top',
        pad=dict(t=0, r=10),
        buttons=[
            dict(label='▶️ Play',
                 method='animate',
                 args=[None, dict(frame=dict(duration=100, redraw=True), 
                                  fromcurrent=True, mode='immediate', transition=dict(duration=0))]),
            dict(label='⏸️ Pause',
                 method='animate',
                 args=[[None], dict(frame=dict(duration=0, redraw=True), 
                                    mode='immediate', transition=dict(duration=0))])
        ]
    )],
    scene=dict(
        xaxis_title='Year',
        yaxis_title='Price',
        zaxis_title='KM Driven'
    ),
    margin=dict(l=0, r=0, b=0, t=30)
)

# วนลูปเรื่อยๆ
fig.frames = frames + [go.Frame(layout=dict(scene=dict(camera=dict(eye=dict(x=1.5*np.cos(0), y=1.5*np.sin(0), z=0.5)))))]

st.plotly_chart(fig, use_container_width=True)


# ==========================================
# 3. ตั้งค่าโครงสร้าง Neural Network
# ==========================================
st.divider()
st.header("2. โครงสร้างอัลกอริทึม (Model Config)")
col1, col2 = st.columns(2)

with col1:
    features = st.multiselect("เลือก Input Features:", ['year', 'selling_price', 'km_driven'], default=['year', 'selling_price', 'km_driven'])
    activation = st.selectbox("เลือกสมการ (Activation):", ['relu', 'sigmoid', 'tanh'])
    learning_rate = st.number_input("Learning Rate:", value=0.1, step=0.01)

with col2:
    hidden_nodes = st.number_input("จำนวน Hidden Nodes:", min_value=1, value=4)
    epochs = st.number_input("จำนวนรอบ (Epochs):", min_value=10, value=100)

st.subheader("กำหนดค่า Weight เริ่มต้น (W1 Matrix)")
default_w1 = np.random.randn(len(features), hidden_nodes).tolist()
custom_w1_str = st.text_area("แก้ค่า JSON ด้านล่างเพื่อกำหนด Weight เอง:", value=json.dumps(default_w1))

# ==========================================
# 4. Training
# ==========================================
if st.button("🚀 เริ่มฝึกสอนโมเดล (Train)", type="primary"):
    if len(features) == 0:
        st.error("กรุณาเลือก Input อย่างน้อย 1 ตัว")
    else:
        X_raw = df[features].values
        y = df['target'].values
        
        # Min-Max Scaling ด้วย Numpy
        X_min = X_raw.min(axis=0)
        X_max = X_raw.max(axis=0)
        # ป้องกันส่วนเป็น 0 กรณี max == min
        denominator = np.where((X_max - X_min) == 0, 1e-8, X_max - X_min)
        X_scaled = (X_raw - X_min) / denominator
        
        nn = SimpleNN(len(features), hidden_nodes, 1, activation)
        
        try:
            custom_w1 = np.array(json.loads(custom_w1_str))
            if custom_w1.shape == (len(features), hidden_nodes):
                nn.W1 = custom_w1
        except:
            st.warning("รูปแบบ Weight ไม่ถูกต้อง จะใช้ค่าเริ่มต้นแทน")

        progress_bar = st.progress(0)
        status_text = st.empty()
        loss_history = []
        
        for epoch in range(epochs):
            pred = nn.forward(X_scaled)
            nn.backward(X_scaled, y, learning_rate)
            
            loss = -np.mean(y * np.log(pred + 1e-8) + (1 - y) * np.log(1 - pred + 1e-8))
            loss_history.append(loss)
            
            if epoch % 10 == 0 or epoch == epochs - 1:
                progress_bar.progress((epoch + 1) / epochs)
                status_text.text(f"กำลังเรียนรู้ รอบที่ {epoch+1}/{epochs} | Loss: {loss:.4f}")
                
        st.success("🎉 การฝึกสอนเสร็จสมบูรณ์!")
        st.line_chart(loss_history)
        
        st.session_state['nn'] = nn
        st.session_state['X_min'] = X_min
        st.session_state['denominator'] = denominator
        st.session_state['features'] = features

st.divider()

# ==========================================
# 5. Prediction
# ==========================================
st.header("3. ทดสอบพยากรณ์ข้อมูล (Prediction)")
if 'nn' in st.session_state:
    cols = st.columns(len(st.session_state['features']))
    pred_inputs = []
    
    for idx, f in enumerate(st.session_state['features']):
        with cols[idx]:
            val = st.number_input(f"กรอกค่า {f}:", value=float(df[f].median()))
            pred_inputs.append(val)
            
    if st.button("🔮 ทำนายผล"):
        X_new_scaled = (np.array([pred_inputs]) - st.session_state['X_min']) / st.session_state['denominator']
        result = st.session_state['nn'].forward(X_new_scaled)[0][0]
        
        if result > 0.5:
            st.success(f"**พยากรณ์:** รถคันนี้เป็นเกียร์อัตโนมัติ (Automatic) | ความน่าจะเป็น: {result*100:.2f}%")
        else:
            st.info(f"**พยากรณ์:** รถคันนี้เป็นเกียร์ธรรมดา (Manual) | ความน่าจะเป็น: {(1-result)*100:.2f}%")
else:
    st.warning("กรุณากดปุ่ม Train โมเดลก่อนทำการพยากรณ์")