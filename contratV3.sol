// Contrat de la version 2
pragma solidity ^0.8.13;

// 1. Le requester crée une tâche avec un titre et une description
// 2. Le helper s'inscrit pour la tâche et peut se désinscrire tant que la tâche n'est pas complétée
// 3. Le validator s'inscrit pour la tâche et peut se désinscrire tant que la tâche n'est pas complétée
// 4. Le validator peut marquer la tâche comme complétée s'il existe et si un helper est inscrit
// 5. Tant que la tâche n'est pas complétée, le requester peut annuler la tâche.

contract TaskTurtleV3 {
    struct Task {
        address requester;
        address helper;
        address validator;
        string title;
        string description;
        bool isCompleted;
        bool isCancelled;
        uint helperReward;
        uint validatorReward;
    }

    mapping(uint256 => Task) public tasks;
    uint256 public currentTaskId;

    event TaskCreated(uint256 taskId, address requester);
    event HelperRegistered(uint256 taskId, address helper);
    event HelperUnregistered(uint256 taskId, address helper);
    event ValidatorRegistered(uint256 taskId, address validator);
    event ValidatorUnregistered(uint256 taskId, address validator);
    event TaskCompleted(uint256 taskId);
    event TaskCancelled(uint256 taskId);
    event TaskUnvalidated(uint256 taskId);
    event TaskConfirmed(uint256 taskId);

    // La tâche est créée par le requester
    function createTask(string memory _description, string memory _title, uint _helperReward, uint _validatorReward) public payable {
        require(_helperReward > 0);
        require(_validatorReward > 0);
        require(msg.value >= _helperReward + _validatorReward, "Not enough funds to pay helpers and validators");
        currentTaskId++;
        tasks[currentTaskId] = Task({
            requester: msg.sender,
            helper: address(0),
            title: _title,
            description: _description,
            isCompleted: false,
            isCancelled: false,
            helperReward: _helperReward,
            validatorReward: _validatorReward
        });

        payable(address(this)).transfer(msg.value); // On transfère les fonds au contrat

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

    // Le validator s'inscrit pour la tâche
    function registerAsValidator(uint256 _taskId) public {
        require(tasks[_taskId].requester != address(0), "Task does not exist");
        require(tasks[_taskId].validator == address(0), "Task already has a validator"); //Il ne peut il y avoir qu'un seul validator
        require(tasks[_taskId].isCompleted == false, "Task is already completed");
        require(tasks[_taskId].isCancelled == false, "Task is already cancelled");
        tasks[_taskId].validator = msg.sender;

        emit ValidatorRegistered(_taskId, msg.sender);
    }

    // Le validator peut se désinscrire de la tâche
    function unregisterAsValidator(uint256 _taskId) public {
        require(tasks[_taskId].validator == msg.sender, "Only the assigned validator can renounce the task");
        require(tasks[_taskId].isCompleted == false, "Task is already completed");
        require(tasks[_taskId].isCancelled == false, "Task is already cancelled");
        tasks[_taskId].validator = address(0);

        emit ValidatorUnregistered(_taskId, msg.sender);
    }

    // Le validator peut marquer la tâche comme complétée et le paiement est effectué
    function completeTask(uint256 _taskId) public {
        require(tasks[_taskId].helper != address(0), "Task does not have a helper assigned");
        require(tasks[_taskId].validator != address(0), "Task does not have a validator assigned");
        require(tasks[_taskId].isCompleted == false, "Task is already completed");
        require(tasks[_taskId].isCancelled == false, "Task is already cancelled");
        require(tasks[_taskId].validator == msg.sender, "Only the assigned validator can complete the task");

        tasks[_taskId].isCompleted = true;
        
        //On prends les fonds du contrat pour payer les helpers et le validator
        payable(tasks[_taskId].helper).transfer(tasks[_taskId].helperReward);
        payable(tasks[_taskId].validator).transfer(tasks[_taskId].validatorReward);

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

    function getTasks() public view returns (Task[] memory) {
        Task[] memory _tasks = new Task[](currentTaskId);
        for (uint i = 0; i < currentTaskId; i++) {
            _tasks[i] = tasks[i + 1];
        }
        return _tasks;
    }
}
