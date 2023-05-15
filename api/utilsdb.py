import sqlite3
import secrets

def getAllUsers():
    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM users')
        return cursor.fetchall()
    
def getUserById(user_id):
    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
        return cursor.fetchone()
    
def getTasksByHelper(user_id):
    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM tasks WHERE helper_id = ?', (user_id,))
        return cursor.fetchall()
    
def getTasksByAuthor(user_id):
    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM tasks WHERE author_id = ?', (user_id,))
        return cursor.fetchall()
    
def getTaskById(task_id):
    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM tasks WHERE id = ?', (task_id,))
        return cursor.fetchone()
    
def getUncompletedTasks():
    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT id, title, description, reward, location, author_id, transaction_id FROM tasks WHERE is_completed = 0')
        data = cursor.fetchall()
        tasks = [{
            "id": task[0],
            "title": task[1],
            "description": task[2],
            "reward": task[3],
            "location": task[4],
            "author": cursor.execute('SELECT username FROM users WHERE id = ?', (task[5],)).fetchone()[0],
            "transaction_id": task[6],
        } for task in data]
        return tasks
    
def completeTaskDB(task_id, helper_username):
    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        
        cursor.execute('SELECT author_id, reward FROM tasks WHERE id = ?', (task_id,))
        author_id, reward = cursor.fetchone()
        
        cursor.execute('SELECT id FROM users WHERE username = ?', (helper_username,))
        helper_id = cursor.fetchone()[0]

        cursor.execute('UPDATE tasks SET helper_id = ? WHERE id = ?', (helper_id, task_id))
        cursor.execute('UPDATE tasks SET is_completed = 1 WHERE id = ?', (task_id,))
        cursor.execute('UPDATE users SET balance = balance + ? WHERE id = ?', (reward, helper_id))
        cursor.execute('UPDATE users SET balance = balance - ? WHERE id = ?', (reward, author_id))
        conn.commit()

def addGuestUser(guest_token):
    with sqlite3.connect('database.db') as conn:
        
        private_key = secrets.token_hex(32)  # Generate a random 32-byte private key
        address = private_key[64-40:]  # Take the last 40 characters as the address
    

        cursor = conn.cursor()
        cursor.execute('INSERT INTO users (username, guest_token, address,p_keys) VALUES (?,?,?,?)', ("user" + guest_token, guest_token,'0x'+address,private_key))
        conn.commit()


def addRegisteredUser(username, email):
    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        cursor.execute('INSERT INTO users (username, email) VALUES (?, ?)', (username, email))
        conn.commit()

def getUserBalance(username):
    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT balance FROM users WHERE username = ?', (username,))
        return cursor.fetchone()[0]
    
def addUserBalance(username, amount):
    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        cursor.execute('UPDATE users SET balance = balance + ? WHERE username = ?', (amount, username))
        conn.commit()

def addUserLink(username,link) :
    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        cursor.execute('UPDATE users SET link_to_profile_picture = ? WHERE username = ?', (link, username))
        conn.commit()


def addUserKeys(username,p_keys) :
    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        address = p_keys[64-40:]  # Take the last 40 characters as the address
        cursor.execute('UPDATE users SET p_keys = ?,address = ? WHERE username = ?', (p_keys,'0x'+address, username))
        conn.commit()