import React, {useState} from 'react';

export default function AskForHelpPage() {

  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskLocation, setTaskLocation] = useState('');
  const [taskReward, setTaskReward] = useState('');

  const handleSubmit = () => { }

  return(
  <>
    <h1>Ask For Help</h1>
    <form className="help-form">
      <label>
        Title:
        <input type="text" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} />
      </label>
      <label>
        Description:
        <input type="text" value={taskDescription} onChange={e => setTaskDescription(e.target.value)} />
      </label>
      <label>
        Location:
        <input type="text" value={taskLocation} onChange={e => setTaskLocation(e.target.value)} />
      </label>
      <label>
        Reward:
        <input type="text" value={taskReward} onChange={e => setTaskReward(e.target.value)} />
      </label>
      <input onClick={() => handleSubmit()} type="submit" value="Login" />
    </form>
  </>
  )
}
