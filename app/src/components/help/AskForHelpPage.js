import React, { useState } from 'react';

export default function AskForHelpPage({ username }) {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskLocation, setTaskLocation] = useState('');
  const [taskReward, setTaskReward] = useState('');
  const [submittedText, setSubmittedText] = useState(false);

  function displaySubmittedText() {
    setSubmittedText(true);
    setTimeout(() => {
      setSubmittedText(false);
    }, 2000);
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log('entering handleSubmit');

    const data = {
      username: username,
      taskTitle: taskTitle,
      taskDescription: taskDescription,
      taskLocation: taskLocation,
      taskReward: taskReward,
    };

    fetch('http://localhost:4859/submitTask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          response.text().then((text) => {
            if (text === '') {
              displaySubmittedText();
              setTaskTitle('');
              setTaskDescription('');
              setTaskLocation('');
              setTaskReward('');
            } else {
              console.log(text);
            }
          });
        }
      })
      .catch((error) => console.log(error.message));
  }

  return (
    <>
      <h1>Ask For Help</h1>
      <form className="help-form" onSubmit={handleSubmit}>
        <label>
          Title:
          <input type="text" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} maxLength={35} />
        </label>
        <label>
          Description:
          <input type="text" value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} />
        </label>
        <label>
          Location:
          <input type="text" value={taskLocation} onChange={(e) => setTaskLocation(e.target.value)} />
        </label>
        <label>
          Reward:
          <input type="text" value={taskReward} onChange={(e) => setTaskReward(e.target.value)} pattern="[0-9]*" />
        </label>
        <button type="submit">Submit</button>
      </form>
      { submittedText ? <p>Task submitted successfully</p> : null}
    </>
  );
}
