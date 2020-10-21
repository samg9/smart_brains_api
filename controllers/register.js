  const handleRegister = (req,res,db,bcrypt)=>{

	const {email,name,password} = req.body; 
	
	if(!email || !name || !password){
		return res.status(400).json('incorrect submission form');
	}

	//bcrypt.hash(password, null, null, function(err, hash) {
    // Store hash in your password DB.
    //console.log(hash);
	//});
	const hash = bcrypt.hashSync(password); 


	db.transaction(trx => {
		trx.insert({
			hash: hash, 
			email: email 
		})
		.into('login')
		.returning('email')
		.then(loginEmail =>{
			return trx('users')
				.returning('*')
				.insert({
					email : loginEmail[0] , 
					name : name , 
					joined : new Date()
				}).then(user => {
					res.json(user[0]);
				})	
			})
			.then(trx.commit) //if all these pass
			.catch(trx.rollback)

		})
		.catch(err => res.status(400).json('unable to register'))
	}

	module.exports = {
		handleRegister : handleRegister
	};