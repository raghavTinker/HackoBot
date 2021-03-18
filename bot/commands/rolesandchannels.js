const { prefix } = require("../config");
const csv = require('csvtojson');

module.exports = {
    name : 'register',
    discription : 'Lets you register for discord!',
    usage : `${prefix}register`,
    aliases:["reg"],
    execute(message,args) {
      if(!args.length){
        return message.reply("You can't keep the team name blank!");
        
    }
    csv()
    .fromFile("./hack.csv")
    .then((data)=>{
      const email = args[0];
      const arr=data.filter(lol=>lol.Email===email && `${lol['First Name']} ${lol['Last Name']}`===message.member.nickname);
      //not registerd
      if(!arr.length){
        return message.channel.send('You are not registered');
      }
      //role name
      const team="Team - "+arr[0]['Team Name'];
      // if role already exist
      if(message.guild.roles.cache.find(r=>r.name===team)){
        const role=message.guild.roles.cache.find(r=>r.name===team);
        return message.member.roles.add(role).then(ff=>{
          console.log('rols assigned');
         }).catch(err=>{
           console.log(err);
         })
      }
      if(message.member.roles.cache.some(r=>r.name===team)){
        return message.channel.send('Already Role assigned');
      }
      let ID;   
      try{
        message.guild.roles.create({
          data:{
            name : team,
            color : '#14c7cc' ,
            permissions: ['SEND_MESSAGES', 'VIEW_CHANNEL']
          }
        }).then((role)=>{
          console.log(role)
          message.member.roles.add(role).then(ff=>{
           console.log('rols assigned');
          }).catch(err=>{
            console.log(err);
          })

          message.guild.channels.create(team, {
            name: team,
            type: 'category',
            permissionOverwrites: [
              {
                id: message.guild.id,
                deny: ['VIEW_CHANNEL'],
              },
              {
                id: role.id,
                allow: ['VIEW_CHANNEL'],
              },
            ],
          }).then((channel) =>{
              ID = channel.id;
        })
         
          // creating text channel

          message.guild.channels.create(team, {
            name: team,
            type: 'text', 
            permissionOverwrites: [
              {
                id: message.guild.id,
                deny: ['VIEW_CHANNEL'],
              },
              {
                id: role.id,
                allow: ['VIEW_CHANNEL'],
              },
            ],
          }).then((channel) => {
              channel.setParent(ID);
          })
      
          // creating voice channel
          message.guild.channels.create(team, {
            name: team,
            type: 'voice', 
            permissionOverwrites: [
              {
                id: message.guild.id,
                deny: ['VIEW_CHANNEL'],
              },
              {
                id: role.id,
                allow: ['VIEW_CHANNEL'],
              },
            ],
          })
          .then((channel) => {
              channel.setParent(ID);
          })
          message.channel.bulkDelete(1,true).catch(err=>{
            console.log('Err',err.message);
            message.reply(`There Was An Error Deleing zthe Meassages Reason : ${err.message}`)
        })

        })
       } catch(error)
        {
            console.error(error);
            message.reply("Error: Invalid command or Team can't be created!");
        };
    }).catch(err=>{
      console.log(err);
    })
}
}
