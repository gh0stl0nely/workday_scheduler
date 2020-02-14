// *** RESET DAY IS NOT WRITTEN *** PLEASE LOOK AT IT AGAIN
// ^^^^^^^^^^^^^^^^^^^^^
// Task to be done
// 1) Write Reset Function completely
// 2) Create relationship between edit btn and modal save
// Ideally Edit Btn would reflect what is shown in the modal
// 3) Write DisplayDataFromLocalStorage() to display SCHEDULE ONLY when logged on

// DisplayDataFromLocalStorage()

$(document).ready(function(){

    var timerDate = setInterval(updateDate, 0);
    var timerTime = setInterval(updateTime, 0);
    var hourChecker = setInterval(checkHourPassed, 0); // Render Them color if passed, and edit button not clickable
    var dayChecker = setInterval(checkDayEnd, 1000); // Check if the day has passed, if they do, reset everything ;) 

    // Edit Button will first find the time from the parent id="time" and display it on id="specific-time"
    // Maybe also add event listener to the save button as well? 

    $('.edit-btn').on('click', function(){
        //Clear all content from modal first
        $('#new-content').text('');

        var time = $(this).parent().prev().text();// 
        $('#specific-time').text(time);

        var currentEditBtn = $(this);
        
        if(currentEditBtn.prev().is('p')){
            // First line is to delete everything in modal
           let prevPs = currentEditBtn.prevAll(); //PROBLEM! 
           var p_text = [];
           storeInputValue(p_text, prevPs);
        }

    })
    // The Save Button - Will save and then render the text in the main schedule of that time only
    $('#modal-save').on('click',function(){
        // Save the entire thing in a *array* and then
        // Loop through it to append each of them into second
        // Div of timeBlock (YOU NEED TO CONNECT IT WITH TITLE)

        // $('#myModal').modal('hide');
       

        // First, get the children of the id="new-content"
        var new_task_list = $(this).prev().children(); // Array of input tag

        if(new_task_list.length == 0){
            alert('Empty');
        }

        // Collect the input value of each of them
        // Store them in an array
        var input_value_list = []

        new_task_list.each(function(){
            input_value_list.push($(this).val());
        })

        // Select the id="specific-time".text()#
        var time = $('#specific-time').text();
        var time_slot = $('.time-slot');
        var correct_time_slot; // This is a correct div

        //Find the correct div
        time_slot.each(function(){
            if($(this).text() == time){
                correct_time_slot = $(this);
            }
        })
       

        var correct_task = correct_time_slot.next()// class Task
        // var untilBtn = correct_task.children().nextUntil('button'); //Select all the p until button
        var button = correct_task.children().last();
        
        button.prevAll().each(function(){
            $(this).remove();
        })

        for(var j = 0; j < input_value_list.length;j++){
            var p = $('<p></p>');
            p.text(input_value_list[j]);
            p.insertBefore(button);
        }
     
        

    })

    // The + icon in the modal can now add task
    $("#add-task").on('click', function(){
        var newInput = $('<input>');
        newInput.css('display', 'block');
        $('#new-content').append(newInput);
    })
    
})

function checkDayEnd(){
    // If hour is 0 then reset everything?
    // Select the section id, and go through entire thing and set inner HTML and ""
    var current_hour = new Date().getHours();
    
    if(current_hour == 0){
        // Set everything to 0
        resetDay();
    }

}

function checkHourPassed(){
    // We have section with ID = schedule, in that we have div with ID = 8am, 
    // We can get the current hour ONLY, from 0 to 23
    // Check every 1 second, that for(var i 0 , i in the schedule length; i++); if()

    var current_hour = new Date().getHours();
    var schedule = document.getElementById('schedule');
    var time_block = schedule.children; // This has all the div with id = 8 ...


    for(var i = 0; i < time_block.length; i++){

        var time_slot = time_block[i]; // Select the time slot
        // 
        var time = time_slot.firstElementChild; // This is the first div that shows the time
        var divTask = time_slot.children[1]; // This is the second div (task)
        var add_editBtn = divTask.lastElementChild; // This is the add and edit button

        if(time_slot.id < current_hour){
            // Passed
            time.style.backgroundColor = 'grey';
            add_editBtn.style.backgroundColor = 'grey';
            divTask.style.backgroundColor = 'grey';
            time.style.textDecoration = 'line-through';
            add_editBtn.style.textDecoration = 'line-through';
            divTask.style.textDecoration = 'line-through';
            add_editBtn.disabled = 'true';
            
        } else if(time_slot.id > current_hour){
            // Future
            time.style.backgroundColor = 'greenyellow';
            add_editBtn.style.backgroundColor = 'greenyellow';
            divTask.style.backgroundColor = 'greenyellow';

        } else if(time_slot.id == current_hour) {
            time.style.backgroundColor = 'rgb(214, 244, 253)';
            divTask.style.backgroundColor = 'rgb(214, 244, 253)'
            add_editBtn.style.backgroundColor = 'rgb(214, 244, 253)';
        }  
    }


}

function updateTime(){
    var current = new Date();

    var hour = current.getHours() >= 10 ? current.getHours() : '0' + current.getHours();
    var minute = current.getMinutes() >= 10 ? current.getMinutes() : '0' + current.getMinutes();
    var second = current.getSeconds() >= 10 ? current.getSeconds() : '0' + current.getSeconds();

    var string = hour + ' : ' + minute + ' : ' + second;
    $('#current-time').text(string);
}

function updateDate(){
    var current = new Date();

    var date = current.getDate() >= 10 ? current.getDate() : '0' + current.getDate();
    var day = myGetDay(current);
    var month = myGetMonth(current);
    var year = current.getFullYear();
    
    var string = day + ', ' + month + ' ' + date + ' , ' + year;
    $('#current-date').text(string);
}

// Helper

// Just make sure day is in word (i.e Monday)
function myGetDay(current){
    var day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return day[current.getDay()];
}

// Just make sure month is in word (i.e Jan, Feb)
function myGetMonth(current){
    var month_object = {
        0: 'January',
        1: 'February',
        2: 'March',
        3: 'April',
        4: 'May',
        5: 'June',
        6: 'July',
        7: 'August',
        8: 'September',
        9: 'October',
        10: 'November',
        11: 'December'
    }
    
    return month_object[current.getMonth()];
}

// 
function resetDay(){
    var schedule = document.getElementById('schedule');
    var time_blocks = schedule.children;
    for(var i = 0; i < time_blocks.length; i++){
        time_blocks[i].getElementsByTagName('div')[1].innerHTML = "";
        // Should we update the modal content (new-content) as well?
        // Maybe update localStorage for modal? to empty?
    }
}

function storeInputValue(p_text, prevPs){
   
   for(var i = prevPs.length-1; i >= 0; i--){
        p_text.push(prevPs[i].innerHTML);
   }
   putInputOnModal(p_text);
}

function putInputOnModal(p_text){
         // It is stored input
    for(var j = 0; j < p_text.length;j++){
        var input_text = p_text[j];
        var input_block = $('<input>');            
        input_block.val(input_text);
        input_block.css("display",'block');
        $('#new-content').append(input_block);
    }
}
