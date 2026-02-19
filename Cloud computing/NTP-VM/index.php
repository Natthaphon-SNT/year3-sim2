<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ntp-vm</title>
    <style>
        /* ตั้งค่าให้เนื้อหาทั้งหมดอยู่กึ่งกลาง */
        body {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh; /* ให้ความสูงเต็มหน้าจอ */
            margin: 0;
            font-family: sans-serif;
            text-align: center;
            background-color: #f4f4f4; /* เพิ่มสีพื้นหลังให้อ่านง่าย */
        }

        .profile-container {
            background: white;
            padding: 2rem;
            border-radius: 15px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        .profile-img {
            /* ปรับขนาดรูปให้พอดีและเป็นวงกลม (ถ้าต้องการ) */
            width: 250px; 
            height: 250px;
            object-fit: cover; /* ป้องกันรูปบิดเบี้ยว */
            border-radius: 10px; /* ปรับความโค้งมนของขอบรูป */
            margin-top: 15px;
            border: 3px solid #eee;
        }

        .info {
            font-size: 1.2rem;
            margin-bottom: 10px;
            font-weight: bold;
        }
    </style>
</head>
<body>

    <div class="profile-container">
        <div class="info">
            <?php
                echo "Natthaphon Srinutta";
                echo "<br>";
                echo "ID: 116610905018-5";
            ?>
        </div>
        
        <img src="self.jpg" alt="Profile Picture" class="profile-img">
    </div>

</body>
</html>