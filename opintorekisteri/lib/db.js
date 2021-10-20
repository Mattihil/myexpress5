var mysql = require('mysql');
var connection = mysql.createConnection({
	host:'localhost',
	user:'',
	password:'',
	database:'opintorekisteri'
});
connection.connect(function(error){
	if(!!error) {
		console.log(error);
	} else {
		console.log('Connected..!');
	}
});

module.exports = connection;