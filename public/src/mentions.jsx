import React, { Component } from 'react';
import { Tweet } from 'react-twitter-widgets'
import Spinner from './Spinner'
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import MetaTags from 'react-meta-tags';
import firebase from './firebase';
import fetch from 'node-fetch';
//On page load get ip adress:
var IP = "192.168.1.1";
async function getIp(){
    console.log("GET IP STARTING");
    try{
        const ipResponse = await fetch("https://api.ipify.org/?format=json");
        const ipAsJSon = await ipResponse.json();
        console.log(ipAsJSon.ip);
        IP = ipAsJSon.ip;
        

    }catch(e){
        console.log("Error while fetch : ",e);
    }
    console.log("ip is : ",IP);
}
console.log("Working GET IP");

console.log("GET IP COMPLETED");



var fireBaseDB = firebase.firestore().collection('votes').doc(IP);
var votedTweets = firebase.firestore().collection('votedTweets');
var userLikedTweets = [];
var userDislikedTweets = [];

async function getUserDatas(){
    await getIp();
    var fb = firebase.firestore().collection('votes').doc(IP);
    var userIPdata = await fb.get();
    if(userIPdata.exists){
    //console.log("Data reached ",data.data().count);
    userIPdata.data().likes.map((like)=> userLikedTweets.push(like));
    userIPdata.data().dislikes.map((dislike)=> userDislikedTweets.push(dislike));
    }
}
getUserDatas();


const LOADING_BATCH_SIZE = 5;
class MentionTweet extends Component {

    getLikeCount = async (id) => {
        var fb = firebase.firestore().collection('votedTweets').doc(id);
        var data = await fb.get();
        if(data.exists){
            this.setState({likeCount : data.data().count});
            
        }else{
            this.setState({likeCount : 0});
        }
        

    }

    saveLikeToDB = () =>{
        let id = this.state.mentionid; 
        //console.log("this is : ",this);
        
        let last = [...userLikedTweets,id];
        if(userLikedTweets.includes(id)){
            return;
        }
        userLikedTweets = [...last];
        if(userDislikedTweets.includes(id)){
            const index = userDislikedTweets.indexOf(id);
            userDislikedTweets.splice(index, 1);
        }
        console.log(last);
        firebase.firestore().collection('votes').doc(IP).set({
            likes: last,
            dislikes: [...userDislikedTweets]
        });
        firebase.firestore().collection('votedTweets').doc(id).set({
            count: this.state.likeCount +1
        });
        this.setState({upFlag:true,likeCount:this.state.likeCount+1, downFlag:false});
        this.props.onChange();
    }

    saveDislikeToDB = () =>{
        //console.log("Dislike pressed");
        
        //console.log("this is : ",this);
        let id = this.state.mentionid;
        let last = [...userDislikedTweets,id];
        if(userDislikedTweets.includes(id)){
            return;
        }
        userDislikedTweets = [...last];
        if(userLikedTweets.includes(id)){
            const index = userLikedTweets.indexOf(id);
            userLikedTweets.splice(index, 1);
        }
        
        firebase.firestore().collection('votes').doc(IP).set({
            dislikes: last,
            likes: [...userLikedTweets]
        });
        firebase.firestore().collection('votedTweets').doc(id).set({
            count: this.state.likeCount - 1
        });
        
        this.setState({upFlag:false,likeCount:this.state.likeCount -1, downFlag:true});
        this.props.onChange();
    }

    componentDidMount(){
        
        this.getLikeCount(this.props.mentionId);
        if(userLikedTweets.includes(this.state.mentionid)){
            this.setState({upFlag: true, downFlag: false});
        }
        if(userDislikedTweets.includes(this.state.mentionid)){
            this.setState({upFlag: false, downFlag: true});
        }

    }
    constructor(props){
        super(props);
        this.state = { 
            likes : this.props.likes,
            upFlag : false,
            downFlag : false,
            likeCount: 0,
            mentionid: this.props.mentionId
            }
           this.getLikeCount = this.getLikeCount.bind(this);
           this.saveLikeToDB = this.saveLikeToDB.bind(this);
           this.saveDislikeToDB = this.saveDislikeToDB.bind(this);
    }
    render(){
        let upstyle = {fontSize : "20px",fontWeight:"900"};
        let normalstyle = {fontSize : "20px",fontWeight:"900"};
        if(this.state.upFlag){
            upstyle = {fontSize : "20px",fontWeight:"900",color:"green"};
        }else{
            upstyle = {fontSize : "20px",fontWeight:"900"};
        }
        let downstyle = {fontSize : "20px",fontWeight:"900"};
        if(this.state.downFlag){
            downstyle = {fontSize : "20px",fontWeight:"900",color:"red"};
        }else{
            downstyle = {fontSize : "20px",fontWeight:"900"};
        }
        //col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12
        return ( <div className="row " style={{marginBottom:"15px",width:"100%",marginRight: "0",marginLeft: "0"}}> 
        <div className = "text-align-center col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2" style={{height:"100%",paddingTop:"20px",width:"100%",marginBottom:"-10px",marginLeft:"-10px"}}>
            <div className="row mx-auto text-align-center "><i className="fas fa-arrow-circle-up" onClick = {() => {this.saveLikeToDB();}} style={{...upstyle,fontSize:"33px"}}></i></div>
            <div className="row mx-auto text-align-center" style = {{paddingLeft:"5px"}}><span style={this.state.upFlag? upstyle : this.state.downFlag ? downstyle : normalstyle}>{this.state.likeCount < 10 && this.state.likeCount >= 0 ? "0"+this.state.likeCount.toString():this.state.likeCount}</span></div>
            <div className = "mx-auto row text-align-center"><i className="fas fa-arrow-circle-down" onClick = {() => {this.saveDislikeToDB(); }} style={{...downstyle,fontSize:"33px"}}></i></div>

        </div>
        <div className = "col-xs-9 col-sm-9 col-md-9 col-lg-9 col-xl-9" style = {{marginTop:"15px",boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}><Tweet key = {this.props.mentionId} tweetId = {this.props.mentionId} ></Tweet></div>
    </div>
);
    }
}
class MainTweet extends Component {
    getLikeCount = async (id) => {
        var fb = firebase.firestore().collection('votedTweets').doc(id);
        var data = await fb.get();
        if(data.exists){
            
            return data.data().count;
        }else{
            return 0;
        }
        

    }
    sortIDList = async() =>{
        var listObject = [];
        var twt1 = await this.getLikeCount(this.props.idLs[0]);
        var twt2 = await this.getLikeCount(this.props.idLs[1]);
        var twt3 = await this.getLikeCount(this.props.idLs[2]);

        listObject.push([this.props.idLs[0],twt1]);
        listObject.push([this.props.idLs[1],twt2]);
        listObject.push([this.props.idLs[2],twt3]);
        listObject.sort(function(a,b){
            return b[1] - a[1];
        })
        var sortedls = [];
        sortedls.push(listObject[0][0]);
        sortedls.push(listObject[1][0]);
        sortedls.push(listObject[2][0]);
        this.setState({sortedIdList: [...sortedls]});
        //console.log(sortedls);

    }
    constructor(props){
        super(props);
        this.getLikeCount = this.getLikeCount.bind(this);
        this.sortIDList = this.sortIDList.bind(this);
        this.state = {
            sortedIdList : this.props.idLs
        };
    }
    componentDidMount(){
        
    }
render(){
    this.sortIDList();
    return ( 
        <div style={{border : '7px solid ' + this.props.color,borderTop : '0px'}} className="twt-card twt-card-colored mx-auto pd-auto"> 

        <div><Tweet key={this.props.id} tweetId = {this.props.id} ></Tweet></div>
        <div  className = "mentionsTitle" style={{borderBottom:"1px solid #e1e8ed",paddingBottom:"35px"}}>
            <span style={{float:"left",fontSize: "20px",paddingLeft:"20px"}}>Mentions : </span><i className="fas fa-level-down-alt" style={{float:"right",fontSize : "20px",paddingTop:"5px",paddingRight:"20px"}}></i>
  
        </div>
        <br></br>
    {this.state.sortedIdList.map((mentionId) =>{
        /** ip logic here  */
        var likeCount = 0;
        if(true){
            likeCount = 0;
        }
        return (<MentionTweet key={mentionId} onChange={()=>this.sortIDList()} mentionId = {mentionId} likes = {Math.floor(Math.random() * 30)}>{/*console.log(mentionId)*/}</MentionTweet>);})}
    </div>


     );
}
}
 

 

class Mentions extends Component {

    mentionStyles = {
        border : '3px solid' + this.getRandomColorName(),
        borderTop : '0px'  
    }

    getMentionsData = async() => {
       // this.setState({loading:true});
        let tweetListesi = [];
        try {
            
            const response = await fetch("https://twt-server.herokuapp.com/mentions");
            const jsonData = await response.json();
            
            this.setState({currentTweet:jsonData,hasMention:true,loading:false,currentTweetList:jsonData.slice(0,LOADING_BATCH_SIZE),page:1});
            
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
        loadMore = async() => {
            this.setState({loading:true})
       
            try {
                
                const response = await fetch("https://twt-server.herokuapp.com/mentions/"+this.state.page);
                const jsonData = await response.json();
                const {currentTweetList} = this.state;
                //const newTweets = currentTweet.slice(0,(page)*LOADING_BATCH_SIZE);
                const ctl = [...currentTweetList,...jsonData];
                this.setState({currentTweetList : ctl, page: this.state.page+1, loading: false});
                
            } catch (err) {
                
                console.error(err.message);
            }
            
            
        }

    constructor(props){
        super(props);
        this.getMentionsData = this.getMentionsData.bind(this);
        this.getRandomColorName = this.getRandomColorName.bind(this);
        this.loadMore = this.loadMore.bind(this);
        //get ip
        
        
        
        this.state = {
            currentTweetIndex : 0, 
            currentTweet : [],
            currentTweetList: [],
            page : 1,
            loading : true,
            viralPageCount : 0,
            topPageCount : 0,
            mentionsPageCount : 0,
            tweetStyle : { }
           };
        
    }

    componentDidMount(){
        this.getMentionsData();
        /*window.addEventListener('scroll', ()=> {
            
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                console.log("Helllooo");
                //this.loadMore();
                
            }
         });*/
         /*
         window.addEventListener('load', () => {
            this.setState({tweetStyle:{border : '7px solid' + this.getRandomColorName(),borderTop : '0px'}});
         });
         */
    }
    
    render() { 
        var items = [];
        this.state.currentTweetList.map((item)=>{
            let id = item.tweet_id;
            let idLs = [];
            item.mentions.map((item) => idLs.push(item.tweet_id));
            items.push(<MainTweet key={id} id = {id} idLs = {idLs} color = {this.getRandomColorName()}></MainTweet>);
        });
        return (     
             
        <div className="col-xs-12 col-sm-12 col-md-9 col-lg-6 col-xl-5 mx-auto tweet-area" >
            <MetaTags>
                <title>Top Mentions</title>
                <meta name="description" content="Most Viewed Mentions" />
                <meta property="og:title" content="Onickle Follow The Unseen" />
                 {/*<meta property="og:image" content="path/to/image.jpg" />*/}
            </MetaTags>
           <InfiniteScroll
                    throttle={1000}
                    threshold={300}
                    hasMore={true}
                    onLoadMore={this.loadMore}
            >
            {items} 
            </InfiniteScroll>
            {this.state.loading && (<Spinner></Spinner>)}

            </div>


        
        );
    }
}
 
export default Mentions;