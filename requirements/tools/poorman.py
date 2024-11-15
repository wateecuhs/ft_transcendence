import requests

r = requests.post("https://localhost:8443/matchmaking/rooms/", verify=False, data={"label": "room1"})
print(r.text)

# while True:
#     cmd = input("Enter a command: ")
#     match cmd:
#         case "get":
#             path = input("Enter the path: ")
#             r = requests.get(f"https://localhost:8443/{path}/", verify=False)
#             print(r.json())
#         case "post":
#             path = input("Enter the path: ")
#             r = requests.post(f"https://localhost:8443/{path}/", verify=False)
#             print(r.json())
#         case "exit":
#             break
#         case _:
#             print("cmd can only be 'get', 'post', or 'exit'")