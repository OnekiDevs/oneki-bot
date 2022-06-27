# Data tree
---

a data tree to reference

## Symbols

`->` **=>** specifies if it is a collection, document, etc

`:` **=>** specifies the type of data it contains
-   `array[type]` **=>** an array
-   `tuple[type, ..., ...]` **=>** an tuple

`()` **=>** little description

`?` **=>** may or may not exist

`{}` **=>** a reference since the name is unknown

## Tree
---

```
guilds -> collection
├── {guild_id} -> document
│   ├── prefixies: array[string]
│   ├── premium: bool
│   ├── keep_roles: bool
│   ├── emoji_analisis_enabled: bool
│   ├── emoji_statistics: map
│   │   └── {sticker_id}: number
│   ├── logs_channels: map
│   │   ├── message_update?: string (channel_id)
│   │   ├── message_delete?: string (channel_id)
│   |   ├── invite?: string (channel_id)
│   |   ├── member_update?: string (channel_id)
│   │   └── message_attachment?: string (channel_id)
│   ├── last_suggest: int(id)
│   ├── birthday: map
│   │   ├── channel?: string (id)
│   │   └── message?: string
│   ├── autoroles: map
│   |   └── {group_name}: string (rol_id) 
│   ├── suggest_channels: array[map]
│   │   └── map
│   │       ├── channel: string (id) 
│   │       ├── default: bool
│   │       └── alias?: array[string]
│   ├── suggest -> collection
│   │   └── suggest_{sugges_id} -> document
│   │       ├── author: string (id)
│   │       ├── channel: string (id)
│   │       └── suggest: string
│   └── ...
countings -> collection
├── {guild_id} -> document
│   ├── channel: string (channel_id)
│   ├── current_number: map
│   │   ├── num: int
│   │   └── by: string (member_id)
│   ├── numbers_only: bool
│   ├── record: map
│   │   ├── num: int
│   │   └── time: datetime.utc
│   ├── fail_role: str (role_id)
│   └── users: map
│       └── {user_id}: map
│           ├── correct: int 
│           └── incorrect: int
blacklist -> collection
├── users -> document
│   └── {user_id}: string (reason)
├── guilds -> document
│   └── {guild_id}: string (reason)
users -> collection
├── {user_id} -> document
│   ├── countings: map
│   │   ├── correct: int
│   │   └── incorrect: int
│   └── birthday: string
└── afks -> document
    └── {user_id}: map 
        ├── "reason": string 
        └── "time": datetime.utc
```
