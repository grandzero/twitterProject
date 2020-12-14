const express = require('express');
const app = express();
const cors = require('cors');
const pool = require("./db");
var viralDatas;
var topDatas;
var mentions;
var LOADING_SIZE  = 5;
//middleware
app.use(cors());
app.use(express.json());


//Example Post 
// select * from daily_user_data where video_url != ''
// SELECT * From daily_user_data WHERE video_url != ''
//select count(*) from daily_user_data where img_urls = '' 
//SELECT * FROM daily_user_data ORDER BY likes DESC LIMIT 50
//Get data From sql
async function getAllDatas(){

}
app.get("/datas",async(req,res) => {
    try{
		const d = new Date();
		d.setDate(d.getDate() - 1);
		const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
		const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
		const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
		var de = ye+"-" + mo + "-" +da;
        const allDatas = await pool.query("select * from daily_user_data where timestamp > "+ de + " order by likes desc limit 10");
        viralDatas = allDatas.rows;
        //console.log(allDatas.rows.slice(0,LOADING_SIZE));
        const datas = allDatas.rows.slice(0,LOADING_SIZE);
        
        console.log(datas);
        res.json(datas);
        
    }catch(err){
        console.log("İnside error");
        console.error(err.message);
    }
});

//Load More Items
app.get("/datas/:page",async(req,res) => {
    try{
        const page = parseInt(req.params.page,10);
		const d = new Date();
		d.setDate(d.getDate() - 1);
		const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
		const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
		const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
		var de = ye+"-" + mo + "-" +da;
        const allDatas = await pool.query("select * from daily_user_data where timestamp > "+ de + " order by likes desc limit "+ (page*LOADING_SIZE).toString() + " offset " +  ((page+1)*LOADING_SIZE).toString());

        const datas = allDatas.rows.slice(0,LOADING_SIZE);
        res.json(datas);
        
    }catch(err){
        console.log("İnside error");
        console.error(err.message);
    }
});


app.get("/mentions",async(req,res) => {
    try{
		const d = new Date();
		d.setDate(d.getDate() - 1);
		const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
		const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
		const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
		var de = ye+"-" + mo + "-" +da;
		
        const allDatas = await pool.query("select count(links), links  from daily_user_data where links like '%twitter.com%' AND timestamp > "+ de + " group by links having count(links)>2 limit 5");
        let ls = [];
        
        for(i = 0; i<allDatas.rows.length; ++i){   
            let tempLS = {};
            let tempstr = allDatas.rows[i].links.split("/");
            let id = tempstr[tempstr.length -1];
            tempLS['tweet_id'] = id;
            let ments = await pool.query("select * from daily_user_data where links = "+"'"+allDatas.rows[i].links+"' AND timestamp > " + de +"  order by likes desc limit 3" );
            //ls[allDatas.rows[i].links] = ments;
            tempLS['mentions'] = ments.rows;
            //console.log(ments.rows); 
            ls.push(tempLS);
            
        }
       // console.log(ls);
      // mentions = ls;
       newMentions();
        res.json(ls.slice(0,5));
        
    }catch(err){
        console.error(err.message);
    }
});

app.get("/topDatas",async(req,res) => {
    try{
		const d = new Date();
		d.setDate(d.getDate() - 1);
		const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
		const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
		const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
		var de = ye+"-" + mo + "-" +da;
		
        const allDatas = await pool.query("SELECT * FROM daily_user_data WHERE timestamp > "+ de + " ORDER BY likes DESC LIMIT 5");
        topDatas = allDatas.rows;
        res.json(allDatas.rows.slice(0,LOADING_SIZE));
        
    }catch(err){
        console.error(err.message);
    }
});
app.get("/topDatas/:page",async(req,res) => {
    try{
		const d = new Date();
		d.setDate(d.getDate() - 1);
		const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
		const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
		const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
		var de = ye+"-" + mo + "-" +da;
		
		
		
        const page = parseInt(req.params.page,10);
        const allDatas = await pool.query("SELECT * FROM daily_user_data WHERE timestamp > "+ de + "ORDER BY likes DESC LIMIT " + (page*LOADING_SIZE).toString() + " offset " +  ((page+1)*LOADING_SIZE).toString());
        //const datas = topDatas.slice(page*LOADING_SIZE, (page+1)*LOADING_SIZE);
        res.json(allDatas.rows.slice(0,LOADING_SIZE));
        
    }catch(err){
        console.error(err.message);
    }
});
async function newMentions(){

}
app.get("/mentions/:page",async(req,res) => {
    try{
        const page = parseInt(req.params.page,10);
        //console.log("select count(links), links from daily_user_data where links like '%twitter.com%' group by links having count(links)>2 limit "+ (page*LOADING_SIZE).toString() + " offset " +  ((page+1)*LOADING_SIZE).toString() );
		const d = new Date();
		d.setDate(d.getDate() - 1);
		const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
		const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
		const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
		var de = ye+"-" + mo + "-" +da;
		
        const allDatas = await pool.query("select count(links), links from daily_user_data where links like '%twitter.com%' AND timestamp > "+ de + " group by links having count(links)>2 limit "+ (page*LOADING_SIZE).toString() + " offset " +  ((page+1)*LOADING_SIZE).toString() );
        let ls = [];
        
        for(i = 0; i<allDatas.rows.length; ++i){
            let tempLS = {};
            let tr = allDatas.rows[i].links;
            let tempstr = tr.split("/");
            let id = tempstr[tempstr.length -1];
            tempLS['tweet_id'] = id;
            let ments = await pool.query("select * from daily_user_data where links = "+"'"+allDatas.rows[i].links+"' and timestamp > "+ de + " order by likes desc limit 3" );
            //ls[allDatas.rows[i].links] = ments;
            tempLS['mentions'] = ments.rows;
			
            ls.push(tempLS);
            
        }
       // console.log(ls);
      // mentions = ls;
       newMentions();
        res.json(ls.slice(0,5));
        
    }catch(err){
        console.error(err.message);
    }
});


app.listen(5000,()=>{
    console.log("Server has started on port 5000")
});