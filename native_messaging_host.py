import struct
import sys
import json

# Function to read the incoming message from Chrome
def read_message():
    raw_length = sys.stdin.buffer.read(4)
    if len(raw_length) == 0:
        return None
    message_length = struct.unpack('=I', raw_length)[0]
    message = sys.stdin.buffer.read(message_length).decode('utf-8')
    return json.loads(message)

# Function to send a response to Chrome
def send_message(message):
    encoded = json.dumps(message).encode('utf-8')
    sys.stdout.buffer.write(struct.pack('=I', len(encoded)))
    sys.stdout.buffer.write(encoded)
    sys.stdout.buffer.flush()

# Function to log the message to a file
def log_message(message):
    with open("received_messages.txt", "a") as log_file:
        log_file.write(f"Received: {json.dumps(message)}\n")

if __name__ == "__main__":
    while True:
        try:
            message = read_message()
            if message is None:
                break  # Chrome closed the port

            # Log the received message to the file
            log_message(message)

            # Print and respond to the extension
            print("Received:", message)
            send_message({"response": "Hello from Python and Agu!"})
        except Exception as e:
            send_message({"error": str(e)})
            break
