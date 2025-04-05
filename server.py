from flask import Flask, request
import screen_brightness_control as sbc
from flask_cors import CORS  # Importă CORS
from pycaw.pycaw import AudioUtilities, IAudioEndpointVolume
import comtypes


app = Flask(__name__)

# Adaugă CORS pentru aplicația Flask
CORS(app)  # Permite toate originile, dar poți specifica un domeniu dacă vrei

@app.route('/', methods=['GET'])
def home():
    return "Server is running! Use /brightness endpoint with POST request to adjust brightness."

@app.route('/brightness', methods=['POST'])
def adjust_brightness():
    action = request.json.get('action')
    current_brightness = sbc.get_brightness()[0]
    
    if action == 'increase':
        new_brightness = 100
    elif action == 'decrease':
        new_brightness = 50
    else:
        return {"status": "error", "message": "Invalid action"}, 400
    
    sbc.set_brightness(new_brightness)
    return {"status": "success", "brightness": new_brightness}

@app.route('/audio', methods=['POST'])
def adjust_audio():
    # Inițializare COM
    comtypes.CoInitialize()

    try:
        action = request.json.get('action')

        # Obține controlul asupra volumului
        devices = AudioUtilities.GetSpeakers()
        interface = devices.Activate(
            IAudioEndpointVolume._iid_, 1, None)
        volume = interface.QueryInterface(IAudioEndpointVolume)

        # Obține volumul curent (ca procentaj între 0 și 100)
        current_volume = volume.GetMasterVolumeLevelScalar() * 100

        if action == 'increase':
            new_volume = min(100, current_volume + 10)  # Crește volumul cu 10%, maxim 100%
        elif action == 'decrease':
            new_volume = max(0, current_volume - 10)  # Scade volumul cu 10%, minim 0%
        else:
            return {"status": "error", "message": "Invalid action"}, 400
        
        # Setează volumul nou
        volume.SetMasterVolumeLevelScalar(new_volume / 100.0, None)  # Setează volumul

        return {"status": "success", "volume": new_volume}

    finally:
        # Curățare COM
        comtypes.CoUninitialize()

if __name__ == "__main__":
    app.run(host='localhost', port=5050)
