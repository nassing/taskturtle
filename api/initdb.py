import sqlite3

# with sqlite3.connect('database.db') as conn:
#     conn.execute('CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, guest_token TEXT NOT NULL UNIQUE, link_to_profile_picture TEXT, balance INTEGER DEFAULT 0, adress TEXT NOT NULL UNIQUE)')

#     conn.execute('CREATE TABLE transactions (id INTEGER PRIMARY KEY AUTOINCREMENT, sender_id INTEGER NOT NULL, receiver_id INTEGER NOT NULL, amount INTEGER NOT NULL, date TEXT NOT NULL, FOREIGN KEY(sender_id) REFERENCES users(id), FOREIGN KEY(receiver_id) REFERENCES users(id))')

#     conn.execute('CREATE TABLE tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, description TEXT NOT NULL, reward INTEGER NOT NULL DEFAULT 0, location TEXT, author_id INTEGER NOT NULL, helper_id INTEGER, is_completed INTEGER NOT NULL DEFAULT 0, FOREIGN KEY(author_id) REFERENCES users(id), FOREIGN KEY(helper_id) REFERENCES users(id))')

def init_db() :
    
    with sqlite3.connect('database.db') as conn:
        conn.execute('CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, guest_token TEXT NOT NULL UNIQUE, link_to_profile_picture TEXT, balance INTEGER DEFAULT 0, address TEXT NOT NULL UNIQUE)')

        conn.execute('CREATE TABLE transactions (id INTEGER PRIMARY KEY AUTOINCREMENT, sender_id INTEGER NOT NULL, receiver_id INTEGER NOT NULL, amount INTEGER NOT NULL, date TEXT NOT NULL, FOREIGN KEY(sender_id) REFERENCES users(id), FOREIGN KEY(receiver_id) REFERENCES users(id))')

        conn.execute('CREATE TABLE tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, description TEXT NOT NULL, reward INTEGER NOT NULL DEFAULT 0, location TEXT, author_id INTEGER NOT NULL, helper_id INTEGER, is_completed INTEGER NOT NULL DEFAULT 0, FOREIGN KEY(author_id) REFERENCES users(id), FOREIGN KEY(helper_id) REFERENCES users(id))')
