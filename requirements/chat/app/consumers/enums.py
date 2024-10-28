from enum import Enum


class MessageType(Enum):
    class CommandType(Enum):
        WHISPER = "whisper"
        BLOCK = "block"
        UNBLOCK = "unblock"
        PROFILE = "profile"

    STATUS = "status"
    GLOBAL = "global"


class UserStatus(Enum):
    ONLINE = "online"
    OFFLINE = "offline"
    PLAYING = "playing"
