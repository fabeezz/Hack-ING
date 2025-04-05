import tkinter as tk
from tkinter import ttk, messagebox
import screen_brightness_control as sbc
import win32api
import win32con
import pynput
import cv2
import threading

# Inițializare fereastră
root = tk.Tk()
root.title("Accessibility Toolbox")
root.geometry("400x300")

# Label de bun venit
label = tk.Label(root, text="Welcome to the Accessibility Toolbox", font=("Arial", 14))
label.pack(pady=20)

# Frame pentru butoane
button_frame = ttk.Frame(root)
button_frame.pack(pady=10)

# Funcții pentru control
def adjust_brightness():
    current_brightness = sbc.get_brightness()[0]  # Ia luminozitatea curentă
    new_brightness = min(100, current_brightness + 10)  # Crește cu 10%
    sbc.set_brightness(new_brightness)
    messagebox.showinfo("Brightness", f"Brightness set to {new_brightness}%")

def adjust_volume():
    # Folosim win32api pentru a simula tastele de volum
    win32api.keybd_event(win32con.VK_VOLUME_UP, 0)
    win32api.keybd_event(win32con.VK_VOLUME_UP, 0, win32con.KEYEVENTF_KEYUP)
    messagebox.showinfo("Volume", "Volume increased")

def move_mouse():
    mouse = pynput.mouse.Controller()
    mouse.move(50, 50)  # Mișcă mouse-ul 50px dreapta și jos
    messagebox.showinfo("Mouse", "Mouse moved 50px right and down")

def open_camera():
    def camera_thread():
        cap = cv2.VideoCapture(0)  # Deschide camera implicită
        if not cap.isOpened():
            messagebox.showerror("Camera", "Could not access the camera")
            return
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            cv2.imshow("Camera", frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):  # Apasă 'q' să închizi
                break
        cap.release()
        cv2.destroyAllWindows()
    
    # Rulează camera într-un thread separat ca să nu blocheze UI-ul
    threading.Thread(target=camera_thread, daemon=True).start()

# Butoane pentru funcționalități
btn_brightness = ttk.Button(button_frame, text="Increase Brightness", command=adjust_brightness)
btn_brightness.grid(row=0, column=0, padx=5, pady=5)

btn_volume = ttk.Button(button_frame, text="Increase Volume", command=adjust_volume)
btn_volume.grid(row=0, column=1, padx=5, pady=5)

btn_mouse = ttk.Button(button_frame, text="Move Mouse", command=move_mouse)
btn_mouse.grid(row=0, column=2, padx=5, pady=5)

btn_camera = ttk.Button(button_frame, text="Open Camera", command=open_camera)
btn_camera.grid(row=1, column=0, padx=5, pady=5)

# Funcție placeholder pentru alte features
def feature_not_implemented():
    messagebox.showinfo("Info", "This feature is coming soon!")

btn_settings = ttk.Button(button_frame, text="Settings", command=feature_not_implemented)
btn_settings.grid(row=1, column=1, padx=5, pady=5)

# Pornire aplicație
root.mainloop()