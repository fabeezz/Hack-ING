import struct
import sys
import json

# Function to read the incoming message from Chrome
def read_message():
    try:
        raw_length = sys.stdin.buffer.read(4)
        if len(raw_length) == 0:
            return None
        message_length = struct.unpack('=I', raw_length)[0]
        message = sys.stdin.buffer.read(message_length).decode('utf-8')
        print(f"Received message: {message}")  # Debugging print
        return json.loads(message)
    except Exception as e:
        print(f"Error reading message: {e}")
        return None

# Function to send a response to Chrome
def send_message(message):
    encoded = json.dumps(message).encode('utf-8')
    sys.stdout.buffer.write(struct.pack('=I', len(encoded)))
    sys.stdout.buffer.write(encoded)
    sys.stdout.buffer.flush()

if __name__ == "__main__":
    print("Native messaging host started")  # Debugging print
    while True:
        try:
            message = read_message()
            if message is None:
                break  # Chrome closed the port
            print("Received:", message)
            send_message({"response": "Hello from Python and Agu!"})
        except Exception as e:
            send_message({"error": str(e)})
            break
