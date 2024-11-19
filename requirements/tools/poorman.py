import requests

while True:
    cmd = input("Enter a command: ")
    match cmd:
        case "GET":
            path = input("Enter the path :\nex: chat/messages")
            data ={}
            while True:
                entry = input("Enter the body key-value pair :\nformat: key=value (empty line for eof): ")
                if entry == "":
                    break
                key, value = entry.split("=", 1)
                data[key] = value
            headers = {'Content-Type': 'application/json', 'Accept': 'application/json'}
            while True:
                entry = input("Enter the headers key-value pair :\nformat: key=value (empty line for eof): ")
                if entry == "":
                    break
                key, value = entry.split("=", 1)
                headers[key] = value
            r = requests.get(f"https://localhost:8443/{path}/", verify=False, data=data, headers=headers)
            print(r.json())
        case "POST":
            path = input("Enter the path: ")
            data ={}
            while True:
                entry = input("Enter the body key-value pair :\nformat: key=value (empty line for eof): ")
                if entry == "":
                    break
                key, value = entry.split("=", 1)
                data[key] = value
            headers = {'Accept': 'application/json'}
            while True:
                entry = input("Enter the headers key-value pair :\nformat: key=value (empty line for eof): ")
                if entry == "":
                    break
                key, value = entry.split("=", 1)
                headers[key] = value
            r = requests.post(f"https://localhost:8443/{path}/", verify=False, json=data, headers=headers)
            print(r.json())
        case "PUT":
            path = input("Enter the path: ")
            data ={}
            while True:
                entry = input("Enter the body key-value pair :\nformat: key=value (empty line for eof): ")
                if entry == "":
                    break
                key, value = entry.split("=", 1)
                data[key] = value
            headers = {'Content-Type': 'application/json', 'Accept': 'application/json'}
            while True:
                entry = input("Enter the headers key-value pair :\nformat: key=value (empty line for eof): ")
                if entry == "":
                    break
                key, value = entry.split("=", 1)
                headers[key] = value
            r = requests.put(f"https://localhost:8443/{path}/", verify=False, data=data, headers=headers)
            print(r.json())
        case "exit":
            break
        case _:
            print("cmd can only be 'get', 'post', 'put', or 'exit'")