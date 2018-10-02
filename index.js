var readline = require('readline');

var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})

rl.setPrompt("quiz> ");

/* 
	quiz question format
	It is an array of objects of questions
	Each question object has the question, answer and options properties
	The question property is a string
	The options property is an array of strings of options.
	The answer property is a number signifying the index of the correct answer in the options array
*/

var questions = [{
			"question":"Who is Nigeria's president",
			"answer":2,
			"options":["Goodluck Jonathan","Buhari"]
		},
		{
			"question":"Who is Nigeria's vice-president",
			"answer":1,
			"options":["Osibanjo","Shekarau"]
		},
		{
			"question":"When did Nigeria gain independence?",
			"answer":3,
			"options":["1998","1759","1960"]
		}
	]
questions.forEach(function(question){
	question['taken'] = false;
})
var qno ;
var mode = "question" ; // can be question or answer
var correct_answers = [];

rl.question("Are you ready to play my game?\n Answer with y/n\n",function(answer){
	if(answer.toLowerCase() == 'y'){
		console.log(`I see you are interested in the game`);
		console.log(`Let's get this ball rolling`);
		console.log(`Please select a question number between 1-${questions.length}`);
		rl.prompt();
	}
	else{
		console.log(`I see you are not interested in the game`);
		rl.close();
		return false;
	}
})

function unanswered_questions(){
	// we create an array of unanswered questions
	var available_qs = [];
	questions.forEach(function(question,index){
		if(!question['taken']){
			available_qs.push(index+1);
		}
	})
	return available_qs.join(',');
}

function check_end(){
	var end = true;
	for(var i = 0; i < questions.length; i++){
		if(!questions[i]['taken']){
			// if it is not taken, we end the loop
			end = false;
			break;
		}
	}
	if(end){
		console.log('We have reached the end of the game.');
		console.log('Thanks for being a good player');
		rl.question('Do you want to play again? y/n',function(response){
			var answer = response.trim();
			if(response == 'y'){
				questions.forEach(function(question){
					question['taken'] = false;
					return ;
				});
				console.log('You are good to go!');
				console.log('Let us get the ball rolling');
				mode = 'question';
			}
			else{
				console.log(`These are the questions you answered ${correct_answers}`)
			}
		})
	}
}

rl.on('line',function(line){
	var answer = line.trim();
	if(mode == 'question'){
		// we check for the question number availability;
		var question_number = Number(answer)?Number(answer):null;
		// if it is a valid number;
		if(question_number){
			qno = question_number - 1; // store the question with array indexing pattern
			if(qno > questions.length){
				var available_questions = unanswered_questions();
				console.log(`Please try another question`);
				console.log(`These are the available ones ${available_questions}`)
				rl.prompt();
				return;
			}
			if(questions[qno]['taken'] == true){
				var available_questions = unanswered_questions();
				console.log(`Please try another question`);
				console.log(`These are the available ones ${available_questions}`)
				rl.prompt();
				return;
			}
			else{
				console.log(questions[qno]['question']);
				questions[qno]['options'].forEach(function(option,index){
					console.log(`${index+1}. ${option} `);
				})
				mode = "answer"; // we now change the mode to answer mode
			}
		}
		else{
			// it is not a valid number, allow him to retry.
			console.log(`You inputted an invalid number ${answer}`);
		}
	}
	else {
		// mode is answer
		// check if it is a legit answer.
		var option_number = Number(answer)?Number(answer):null;
		if(option_number){
			var valid_answer = questions[qno]['options'].length >= option_number? true :false;
			if(valid_answer){
				// check for the correctness of the answer;
				if(questions[qno]['answer'] == option_number){
					questions[qno]['taken'] = true;
					correct_answers.push(qno);
					console.log('Correct answer! You must be a smart young man');
					var available_questions = unanswered_questions();
					console.log(`I believe you want to try more questions? \nThese are the available ones ${unanswered_questions()}`)
					mode = 'question';
					rl.prompt();
					return;
				}
				else{
					questions[qno]['taken'] = true;
					console.log('Incorrect answer!')
					console.log(`The answer is ${questions[qno]['options'][questions[qno]['answer']-1]}`);
					mode = 'question';
					console.log(`I believe you want to try more questions? \nThese are the available ones ${unanswered_questions()}`);
					rl.prompt();
					return ;
				}
			}
			else{
				// invalid number out of options range.
				console.log('Please choose an option within the range as stated in the question');
				rl.prompt();
				return;
			}
		}
		else{
			// invalid string cannot be converted to number type
			console.log('Please choose an option within the range as stated in the question');
			rl.prompt();
			return;
		}
	}
})	