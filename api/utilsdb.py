import sqlite3

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
        cursor.execute('SELECT title, description, reward, location, author_id FROM tasks WHERE is_completed = 0')
        data = cursor.fetchall()
        tasks = [{
            "title": task[0],
            "description": task[1],
            "reward": task[2],
            "location": task[3],
            "author": cursor.execute('SELECT username FROM users WHERE id = ?', (task[4],)).fetchone()[0]
        } for task in data]
        return tasks
    
def completeTask(task_id):
    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT author_id, helper_id, reward FROM tasks WHERE id = ?', (task_id,))
        author_id, helper_id, reward = cursor.fetchone()
        if helper_id == None:
            cursor.execute('UPDATE tasks SET is_completed = 1 WHERE id = ?', (task_id,))
            cursor.commit()
        else:
            cursor.execute('UPDATE tasks SET is_completed = 1 WHERE id = ?', (task_id,))
            cursor.execute('UPDATE users SET balance = balance - ? WHERE id = ?', (reward, author_id))
            cursor.execute('UPDATE users SET balance = balance + ? WHERE id = ?', (reward, helper_id))
            cursor.commit()

def addGuestUser(guest_token):
    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        cursor.execute('INSERT INTO users (username, guest_token) VALUES (?)', ("user" + guest_token, guest_token))
        cursor.commit()


def addRegisteredUser(username, email):
    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        cursor.execute('INSERT INTO users (username, email) VALUES (?, ?)', (username, email))
        cursor.commit()

def getUserBalance(username):
    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT balance FROM users WHERE username = ?', (username,))
        return cursor.fetchone()[0]
    
def addUserBalance(username, amount):
    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        cursor.execute('UPDATE users SET balance = balance + ? WHERE username = ?', (amount, username))
        cursor.commit()