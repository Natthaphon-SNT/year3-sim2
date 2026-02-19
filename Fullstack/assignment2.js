
const container = document.getElementById('resumeContainer');
const editBtn = document.getElementById('editBtn');
const saveBtn = document.getElementById('saveBtn');
const cancelBtn = document.getElementById('cancelBtn');
const imageInput = document.getElementById('imageInput');
const profileImageDisplay = document.getElementById('profileImageDisplay');

const fieldMap = {
    'name': { display: 'nameDisplay', input: 'nameInput', required: true },
    'job': { display: 'jobDisplay', input: 'jobInput' },
    'phone': { display: 'phoneDisplay', input: 'phoneInput', required: true },
    'email': { display: 'emailDisplay', input: 'emailInput', required: true, isEmail: true },
    'location': { display: 'locationDisplay', input: 'locationInput' },
    'summary': { display: 'summaryDisplay', input: 'summaryInput' },
};

function toggleEditMode(enable) {
    if (enable) {
        container.classList.add('edit-mode');
        editBtn.style.display = 'none';
        saveBtn.style.display = 'inline-block';
        cancelBtn.style.display = 'inline-block';

        for (let key in fieldMap) {
            const displayEl = document.getElementById(fieldMap[key].display);
            const inputEl = document.getElementById(fieldMap[key].input);
            inputEl.value = displayEl.innerText.trim();
            inputEl.classList.remove('input-error'); 
        }

    } else {
        container.classList.remove('edit-mode');
        editBtn.style.display = 'inline-block';
        saveBtn.style.display = 'none';
        cancelBtn.style.display = 'none';
        imageInput.value = '';
    }
}

function saveData() {
    let isValid = true;
    let firstErrorInput = null;

    for (let key in fieldMap) {
        const field = fieldMap[key];
        const inputEl = document.getElementById(field.input);
        const value = inputEl.value.trim();

        inputEl.classList.remove('input-error');

        if (field.required && value === '') {
            inputEl.classList.add('input-error');
            isValid = false;
            if (!firstErrorInput) firstErrorInput = inputEl;
        }
        
        if (field.isEmail && value !== '' && !validateEmail(value)) {
            inputEl.classList.add('input-error');
            isValid = false;
            if (!firstErrorInput) firstErrorInput = inputEl;
        }
    }

    if (!isValid) {
        alert('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วนและถูกต้อง (ช่องสีแดง)');
        if (firstErrorInput) firstErrorInput.focus(); 
        return; 
    }

    for (let key in fieldMap) {
        const displayEl = document.getElementById(fieldMap[key].display);
        const inputEl = document.getElementById(fieldMap[key].input);
        displayEl.innerText = inputEl.value.trim();
    }

    if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            profileImageDisplay.src = e.target.result;
        }

        reader.readAsDataURL(imageInput.files[0]);
    }

    toggleEditMode(false);
    alert('บันทึกข้อมูลเรียบร้อยแล้ว!');
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

imageInput.addEventListener('change', function () {
    if (this.files && this.files[0]) {
        if (this.files[0].size > 2 * 1024 * 1024) {
            alert('ไฟล์รูปภาพต้องมีขนาดไม่เกิน 2MB');
            this.value = '';
            return;
        }
    }
});
