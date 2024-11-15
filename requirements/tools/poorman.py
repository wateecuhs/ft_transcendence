import requests

while True:
    cmd = input("Enter a command: ")
    match cmd:
        case "get":
            path = input("Enter the path: ")
            data ={}
            while path != "stop":
                entry = input("Enter the key-value pair (empty line for eof): ")
                if entry == "":
                    break
                key, value = entry.split()
                data[key] = value
            r = requests.get(f"https://localhost:8443/{path}/", verify=False, data=data)
            print(r.json())
        case "post":
            path = input("Enter the path: ")
            data ={}
            while path != "stop":
                entry = input("Enter the key-value pair (empty line for eof): ")
                if entry == "":
                    break
                key, value = entry.split()
                data[key] = value
            r = requests.post(f"https://localhost:8443/{path}/", verify=False, data=data)
            print(r.json())
        case "exit":
            break
        case _:
            print("cmd can only be 'get', 'post', or 'exit'")