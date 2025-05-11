# 🌿 Smart Agricultural Rover - Live Plant Disease Detection

A multilingual web-based system powered by a smart rover that **captures live video of plant leaves**, **detects the plant type and disease**, and **speaks out the results** in the user's preferred language. The system uses **Raspberry Pi for ML inference**, **Arduino for motor control**, and integrates a full **frontend-backend stack** for real-time monitoring and control.

---

## 🚀 Features

- 🎥 **Live Video Streaming** from rover-mounted camera
- 🧠 **Real-time Plant & Disease Detection** using a trained ML model on Raspberry Pi
- 🤖 **Rover Control** via Arduino and motor driver
- 🗣️ **Multilingual Support**: UI translation and voice output in multiple languages
- 🖥️ **Frontend Dashboard** to control rover and view results
- 🌐 **Backend Integration** for communication, inference handling, and data routing

---

## 🧱 Architecture Overview


---

## ⚙️ Hardware Used

- 🔌 **Raspberry Pi 6** — ML computation, camera input, backend host
- 🎮 **Arduino UNO/Nano** — Rover motor control
- 🎥 **Pi Camera / USB Webcam** — Leaf video capture
- 🔋 **Motor Driver (L298N)** — To control motors

---

## 💻 Frontend

- Built with **HTML, CSS, JavaScript**
- Translates UI using **Google Translate API / i18n.js**
- Uses **Text-to-Speech (TTS)** for voice output
- Controls rover (Forward, Backward, Left, Right, Stop) via buttons
- Displays live video stream and plant health status

---

## 🔧 Backend

- Developed with **Python (Flask)**
- Routes live video using MJPEG streaming
- Performs inference using **TensorFlow Lite**
- Communicates with Arduino via **serial (pySerial)**
- Converts disease predictions to voice (using pyttsx3 or gTTS)
- Provides multilingual text response and audio output

---

## 🧠 Machine Learning Model

- Trained using [PlantVillage Dataset](https://www.kaggle.com/datasets/emmarex/plantdisease)
- Custom CNN model trained in TensorFlow and converted to `.tflite`
- Predicts:
  - 🌱 Plant type (Tomato, Potato, Apple, etc.)
  - 🦠 Disease type (Blight, Rust, Mildew, etc.)
- Achieves >90% accuracy on validation data

---

## 🗣️ Multilingual and Voice Features

- 🌍 Translate UI text using:
  - Google Translate API or client-side libraries
- 🔊 Text-to-Speech (TTS) options:
  - `gTTS` for web voice output
  - `pyttsx3` for Raspberry Pi speaker
- Supports Hindi, Tamil, Telugu, English, Kannada, and more!

---

## 📂 Folder Structure

├── backend/
│ ├── app.py # Flask backend
│ ├── model.tflite # Trained TFLite model
│ └── labels.txt
├── frontend/
│ ├── index.html
│ ├── styles.css
│ ├── script.js
│ └── translation.js # Multilingual support
├── arduino/
│ └── rover_control.ino # Motor control code
├── README.md

yaml
Copy
Edit


---

## 🛠️ How to Run

### 🐍 Backend
```bash
cd backend
pip install -r requirements.txt
python app.py


