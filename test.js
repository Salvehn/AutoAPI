let json={
    users:[
        {id:'3135419312',value:'lorem2'},
        {id:'764219312',value:'ipsium'},
        {id:'3513195312',value:'lorem2'},
        {id:'85236t231',value:'ipsium2'},
        {id:'85236t231',value:'lorem'}
],
    posts:[{id:'52133',user_id:'3135419312',text:'412'},{id:'55412',user_id:'3135419312',text:'6saflksa'},{id:'545412',user_id:'3513195312',text:'sfsxaaflksa'}],
    images:[{post_id:'52133',src:'a'},{post_id:'55412',src:'b'}],
    followers:[{uid:'3135419312',fid:'85236t231'},{fid:'3135419312',uid:'85236t231'},{uid:'3135419312',fid:'3513195312'}]
}



let query = {
	users:{
		search:{value:'lorem2'},
    deps:[
    	{posts:{
      	on:{users:'id',posts:'user_id'},
        deps:[{images:{on:{images:'post_id',posts:'id'}}}]
        }
      }

    ]
	}
}
const iniKey = (obj)=>{
	return Object.keys(obj)[0]
}

const recJoin = (json,query)=>{
    let key=iniKey(query)
	//console.log('arguments',json,key,query)
	let search = query[key].search
    search = Object.entries(search)
	const res = json[key].filter(x=>{
     	return search.map(s=>{

            if(Array.isArray(s[1])){
                return s[1].includes(x[s[0]])
            }else{
                return x[s[0]]==s[1]
            }

        }).every(b=>b==true)
    })
   	let deps = query[key].deps ||[]
    deps=deps.filter(x=>{

   		return Object.keys(x[iniKey(x)]).some(r=> ['on','search'].includes(r))
    })

    deps.forEach((d,di)=>{

      	if(d[iniKey(d)].on){
            let main_key = d[iniKey(d)].on[key]
            let child_key = d[iniKey(d)].on[Object.keys(d[iniKey(d)].on).find(x=>x!=key)]
            let child_collection = Object.keys(d[iniKey(d)].on).find(x=>x!=key)
         	let join_all = {[child_collection]:{search:{[child_key]:res.map(x=>x[main_key])}}}
            let join = recJoin(json,join_all)
            join.forEach((j, ji) => {
                if(res[res.findIndex(x=>x[main_key]==j[child_key])][child_collection]){
                    res[res.findIndex(x=>x[main_key]==j[child_key])][child_collection].push(j)
                }else{
                    res[res.findIndex(x=>x[main_key]==j[child_key])][child_collection]=[j]
                }
                if(ji==join.length-1){
                    console.log(res)
                }
            });
        }else{
        	console.log('no join')
        }

    	if(d[iniKey(d)].deps){

        }
    })
    //console.log(deps)
    return res
}

recJoin(json,query)
