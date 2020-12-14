import React, { Component } from 'react';
import { Tweet } from 'react-twitter-widgets'
import TopNavBar from './TopNavBar'
import Spinner from './Spinner'

/*import {TwitterVideoEmbed,TwitterTweetEmbed}  from 'react-twitter-embed';*/
const LOADING_BATCH_SIZE = 5;
const twt1 = {
  tweet_id : 0,
  username :"Barack Obama",
  screen_name : "BarackObama",
  text:"We've seen all too terribly the consequences of those who denied warnings of a pandemic. We can't afford any more consequences of climate denial. All of us, especially young people, have to demand better of our government at every level and vote this fall. https://www.latimes.com/politics/story/2020-03-31/trump-rolls-back-fuel-economy-standards",
  tweetUrl : "https://twitter.com/BarackObama/status/1245007713387544576",
  hasMentions : false,
};
const twt2 = {
    tweet_id : 1,
    username :"Barack Obama",
    screen_name : "BarackObama",
    text:"Our medical professionals are heroes putting their lives on the line to keep our country going. Here's a look at how an ER doctor who already fought on the front lines of one crisis makes it through a day in this one. A good reminder for us to help them out by staying home.",
    tweetUrl : "https://twitter.com/golan/status/1240098840532922369",
    hasMentions : false,
};
const twt3 = {
    tweet_id : 2,
    username :"Elon Musk",
    screen_name : "elonmusk",
    text:"We have extra FDA-approved ventilators. Will ship to hospitals worldwide within Tesla delivery regions. Device & shipping cost are free. Only requirement is that the vents are needed immediately for patients, not stored in a warehouse. Please me or @Tesla know.",
    tweetUrl : "https://twitter.com/BarackObama/status/1242493913337913345",
    hasMentions : false,
};
const twt4 = {
    tweet_id : 3,
    username :"Elon Musk",
    screen_name : "elonmusk",
    text:"Would be great to combine blood donations with a C19 antibody test, so you know if you’re immune. Refill blood banks & give donors peace of mind.",
    tweetUrl : "https://twitter.com/elonmusk/status/1245009716935188481",
    hasMentions : true,
    mentions : ["1240098840532922369","511181794914627584","1240098840532922369"]
};
const twt5 = {
    tweet_id : 2,
    username :"John Solomon",
    screen_name : "jsolomonReports",
    text:"Congrats Sharyl for getting this correction . It was a shameful and erroneous attack.",
    tweetUrl : "https://twitter.com/elonmusk/status/1243671937471205383",
    hasMentions : false,
};
const twt6 = {
    tweet_id : 2,
    username :"President's Council",
    screen_name : "FitnessGov",
    text:"Pentacampeón de las Grandes Ligas de Béisbol (MLB) y Co-Presidente de @FitnessGov @MarianoRivera tiene el siguiente mensaje (https://bit.ly/2QKJzZG) para ti sobre COVID-19. #TogetherApart #JuntosAparte @IvankaTrump",
    tweetUrl : "https://twitter.com/jsolomonReports/status/1245898270649581569",
    hasMentions : false,
};
const twt7 = {
    tweet_id : 2,
    username :"Donald J. Trump",
    screen_name : "realDonaldTrump",
    text:"Thank you  @USNationalGuard, keep up the great work!",
    tweetUrl : "https://twitter.com/FitnessGov/status/1243277151937400845",
    hasMentions : false,
};
/** End of Example */
var tweetList = [twt2,twt1,twt3,twt4,twt5,twt6,twt7];
var mentions=["1243954813580214273","1247315634062536705","1247278336407228425"];



class LeftPanel extends Component {

    mentionStyles = {
        border : '3px solid' + this.getRandomColorName(),
        borderTop : '0px'  
    }

    getDatas = async() =>{
       // this.setState({loading:true});
        let tweetListesi = [];
        try {
            
            const response = await fetch("http://localhost:5000/datas");
            const jsonData = await response.json();
            console.log(response);
            this.setState({currentTweet:jsonData,hasMention:false,loading:false,currentTweetList:jsonData.slice(0,LOADING_BATCH_SIZE),page:0});
            
            
        } catch (err) {
            console.error(err.message);
        }
        
        
    }
    getMentionsData = async() => {
       // this.setState({loading:true});
        let tweetListesi = [];
        try {
            
            const response = await fetch("http://localhost:5000/mentions");
            const jsonData = await response.json();
            
            this.setState({currentTweet:jsonData,hasMention:true,loading:false,currentTweetList:jsonData.slice(0,LOADING_BATCH_SIZE),page:0});
            
        } catch (err) {
            console.error(err.message);
        }
        
    }
    getTopData = async() => {
        //this.setState({loading:true});
        let tweetListesi = [];
        try {
            
            const response = await fetch("http://localhost:5000/topDatas");
            const jsonData = await response.json();
            
            this.setState({currentTweet:jsonData,hasMention:false,loading:false,currentTweetList:jsonData.slice(0,LOADING_BATCH_SIZE),page:0});
            
        } catch (err) {
            console.error(err.message);
        }
       
    }
    getRandomColorName(){
        var letters = '0123456789ABCDEF';
        var color = '#';
             for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
         }
         return color;
        }
    loadMore(){
        
        this.setState({currentTweetList : this.state.currentTweet.slice(this.state.page,(this.state.page+1)*LOADING_BATCH_SIZE), page: this.state.page+1, loading: false});
    }

    constructor(props){
        super(props);
        this.getDatas = this.getDatas.bind(this);
        this.getMentionsData = this.getMentionsData.bind(this);
        this.getTopData = this.getTopData.bind(this);
        this.getRandomColorName = this.getRandomColorName.bind(this);
        this.loadMore = this.loadMore.bind(this);

        this.topClick = this.topClick.bind(this);
        this.viralsClick = this.viralsClick.bind(this);
        this.mentionClick = this.mentionClick.bind(this);
        //let tweetlist = [twt2,twt1,twt3,twt4,twt5,twt6,twt7];
        this.getDatas();
        
        
        
        this.state = {
            currentTweetIndex : 0, 
            currentTweet : [],
            currentTweetList: [],
            page : 1,
            hasMention : false,
            loading : true,
            viralPageCount : 0,
            topPageCount : 0,
            mentionsPageCount : 0
           };
        this.tweetlistesi = this.state.currentTweet;
        
    }
    mentionClick(){
        this.setState({loading:true});
        this.getMentionsData();
        
    }
    topClick(){
        this.setState({loading:true});
        this.getTopData();
        
    }
    viralsClick(){
        this.setState({loading:true});
        this.getDatas();
        
    }
    componentDidMount(){
        window.addEventListener('scroll', function() {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                console.log("you're at the bottom of the page");
                
            }
         });
    }
    render() { 
        return (     
             
        <div className="col-xs-12 col-sm-12 col-md-9 col-lg-6 col-xl-5 mx-auto tweet-area" >
           
             <TopNavBar  mentionClick = {this.mentionClick} topClick = {this.topClick} viralsClick = {this.viralsClick}></TopNavBar>
             
            
            
            {this.state.loading ? <Spinner></Spinner> : 
            this.state.hasMention ? 
            /** This part is for if hasMentions true */
            /** this.state.currentTweet */
            this.state.currentTweetList.map((item)=>{
               // let str = item.tweetUrl.split("/");
               // let id = str[str.length-1];
                let id = item.tweet_id;
                let idLs = [];
                item.mentions.map((item) => idLs.push(item.tweet_id));
                return <div key={id} style={{border : '7px solid' + this.getRandomColorName(),borderTop : '0px'}} className="twt-card mx-auto pd-auto"> 
                        <div className = "mentionsTitle" style={{}}>
                            <i class="fas fa-arrow-down" style={{float:"left",fontSize : "20px",paddingTop:"5px",paddingRight:"20px"}}> {Math.floor(Math.random() * 30)}</i>
                            <i className="fas fa-arrow-up" style={{float:"right",fontSize : "20px",paddingTop:"5px",paddingRight:"20px"}}> {Math.floor(Math.random() * 1000)+100}</i>
                            <br></br>
                        </div>
                        <div><Tweet tweetId = {id} ></Tweet></div>
                        <div className = "mentionsTitle" style={{}}>
                            <span style={{float:"left",fontSize: "20px",paddingLeft:"20px"}}>Mentions : </span><i className="fas fa-level-down-alt" style={{float:"right",fontSize : "20px",paddingTop:"5px",paddingRight:"20px"}}></i>
                            <br></br>
                        </div>
                        {idLs.map(mentionId => <div className = "mentionsArea" style = {{marginTop:"15px",boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}><Tweet key = {mentionId} tweetId = {mentionId} ></Tweet></div>)}
                        
                    </div>
                
                }) :
                /** This part is for hasMentions flase */
                /** this.state.currentTweet */
                this.state.currentTweetList.map((item)=>{
               
                   // let ls = item.tweetUrl.split("/");
                   // let id = ls[ls.length-1];
                   let id = item.tweet_id;
                    return <div key={id} className="twt-card mx-auto pd-auto">

                        <div><Tweet tweetId = {id} ></Tweet></div>
                        </div>
                    })
                }
                
                <div className = "col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12" style={{textAlign:'center',marginBottom : '30px'}}>
                <button style={{margin:'auto'}}  onClick={() => this.loadMore()} type="button" className="btn btn-success">Load More</button>
                </div>
            </div>


        
        );
    }
}
 
export default LeftPanel;