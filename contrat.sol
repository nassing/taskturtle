// Contrat de la version 2
pragma solidity ^0.8.13;

// 1. Le requester crée une tâche avec un titre et une description
// 2. Le helper s'inscrit pour la tâche et peut se désinscrire tant que la tâche n'est pas complétée
// 3. Le requester peut marquer la tâche comme complétée si un helper est inscrit
// 4. Tant que la tâche n'est pas complétée, le requester peut annuler la tâche.
// 5. Une fois la tâche complétée, chacun peut noter l'autre

contract TaskTurtleV2 {
    struct Task {
        address requester;
        address helper;
        string title;
        string description;
        bool isCompleted;
        bool isCancelled;
        uint8 requesterRating;
        uint8 helperRating;
    }

    mapping(uint256 => Task) public tasks;
    uint256 public currentTaskId;

    event TaskCreated(uint256 taskId, address requester);
    event HelperRegistered(uint256 taskId, address helper);
    event HelperUnregistered(uint256 taskId, address helper);
    event TaskCompleted(uint256 taskId);
    event TaskCancelled(uint256 taskId);
    event TaskConfirmed(uint256 taskId);
    event RatingGiven(uint256 taskId, address rater, uint8 rating);

    // La tâche est créée par le requester
    function createTask(string memory _description, string memory _title) public {
        currentTaskId++;
        tasks[currentTaskId] = Task({
            requester: msg.sender,
            helper: address(0),
            title: _title,
            description: _description,
            isCompleted: false,
            isCancelled: false,
            requesterRating: 0,
            helperRating: 0
        });

        emit TaskCreated(currentTaskId, msg.sender);
    }

    // Le helper s'inscrit pour la tâche
    function registerAsHelper(uint256 _taskId) public {
        require(tasks[_taskId].requester != address(0), "Task does not exist");
        require(tasks[_taskId].helper == address(0), "Task already has a helper"); //Il ne peut il y avoir qu'un seul helper
        require(tasks[_taskId].isCompleted == false, "Task is already completed");
        require(tasks[_taskId].isCancelled == false, "Task is already cancelled");
        tasks[_taskId].helper = msg.sender;

        emit HelperRegistered(_taskId, msg.sender);
    }

    // Le helper peut se désinscrire de la tâche
    function unregisterAsHelper(uint256 _taskId) public {
        require(tasks[_taskId].helper == msg.sender, "Only the assigned helper can renounce the task");
        require(tasks[_taskId].isCompleted == false, "Task is already completed");
        require(tasks[_taskId].isCancelled == false, "Task is already cancelled");
        tasks[_taskId].helper = address(0);

        emit HelperUnregistered(_taskId, msg.sender);
    }

    // Le requester peut marquer la tâche comme complétée
    function completeTask(uint256 _taskId) public {
        require(tasks[_taskId].helper != address(0), "Task does not have a helper assigned");
        require(tasks[_taskId].isCompleted == false, "Task is already completed");
        require(tasks[_taskId].isCancelled == false, "Task is already cancelled");
        require(tasks[_taskId].requester == msg.sender || tasks[_taskId].helper == msg.sender, "Only the requester or helper can complete the task");

        tasks[_taskId].isCompleted = true;
        emit TaskCompleted(_taskId);
    }

    // Le requester peut annuler la tâche
    function cancelTask(uint256 _taskId) public {
        require(tasks[_taskId].isCompleted == false, "Task is already completed");
        require(tasks[_taskId].isCancelled == false, "Task is already cancelled");
        require(tasks[_taskId].requester == msg.sender, "Only the requester can cancel the task");

        tasks[_taskId].isCancelled = true;
        emit TaskCancelled(_taskId);
    }

    // Chacun peut noter l'autre
    function rateTask(uint256 _taskId, uint8 _rating) public {
        require(tasks[_taskId].isCompleted == true, "Task is not completed yet");
        require(tasks[_taskId].isCancelled == false, "Task is cancelled");
        require(_rating >= -1 && _rating <= 1, "Rating should be -1, 0, or 1");
        require(tasks[_taskId].requester == msg.sender || tasks[_taskId].helper == msg.sender, "Only the requester or helper can rate the task");

        if (tasks[_taskId].requester == msg.sender) {
            tasks[_taskId].requesterRating = uint8(_rating);
        } else {
            tasks[_taskId].helperRating = uint8(_rating);
        }

        emit RatingGiven(_taskId, msg.sender, uint8(_rating));
    }
}
