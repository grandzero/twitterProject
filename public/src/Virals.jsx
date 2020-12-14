import React, { Component } from 'react';
import { Tweet } from 'react-twitter-widgets'
import Spinner from './Spinner'
//import InfiniteScroll from 'react-infinite-scroller';
import { InfiniteScroll } from 'react-simple-infinite-scroll'
import MetaTags from 'react-meta-tags';
 /*
import * as firebase from 'firebase';
var firebaseConfig = {
    apiKey: "AIzaSyBl-XfPHlGwAkvtbPFUM1hsMsLSyeQyD4I",
    authDomain: "twitterproject-5ad00.firebaseapp.com",
    databaseURL: "https://twitterproject-5ad00.firebaseio.com",
    projectId: "twitterproject-5ad00",
    storageBucket: "twitterproject-5ad00.appspot.com",
    messagingSenderId: "623278412282",
    appId: "1:623278412282:web:457125eaaab27db83e9443",
    measurementId: "G-3E8V3S1HHL"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
*/
var counter = 0;
const LOADING_BATCH_SIZE = 5;

class Virals extends Component {


    getDatas = async() =>{
       
       
        try {
            
            const response = await fetch("https://twt-server.herokuapp.com/datas");
            const jsonData = await response.json();
            console.log(jsonData);
            
            this.setState({currentTweet:jsonData,hasMore:true,loading:false,currentTweetList:jsonData.slice(0,LOADING_BATCH_SIZE),page:2});
            
        } catch (err) {
            
           // console.error(err.message);
        }
        
        
    }

    loadMore = async() => {

        this.setState({loading:true});
       
        try {
            
            const response =  await fetch("https://twt-server.herokuapp.com/datas/"+this.state.page);
            const jsonData =  await response.json();
            const {currentTweetList} = this.state;
            //const newTweets = currentTweetList.slice(0,(this.state.page)*LOADING_BATCH_SIZE);
            const ctl = [...currentTweetList,...jsonData];
           this.setState({currentTweetList : ctl, page: this.state.page+1, loading: false, hasMore:true});
           //console.log(ctl);
            
        } catch (err) {
            
           // console.error(err.message);
        }
        
        
    }

    

    constructor(props){
        super(props);
        this.getDatas = this.getDatas.bind(this);
        this.loadMore = this.loadMore.bind(this);

        
        
        
        this.state = {
            currentTweetIndex : 0, 
            currentTweet : [],
            currentTweetList: [],
            page : 1,
            hasMore : true,
            loading : true,
            viralPageCount : 0,
            topPageCount : 0,
            mentionsPageCount : 0,
            
           };
           
       
        
    }


    componentDidMount(){
       /* fetch('https://api.ipify.org?format=jsonp?callback=?',{
            method: 'GET',
            headers: {}
          }).then(res =>{
            return res.text();
          }).then(ip =>{
            console.log(ip);
          });*/


        this.getDatas();
        this.setState({hasMore:true});

        /*
        window.addEventListener('scroll', () => {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
               // this.loadMore();
            }
         });*/
    }
    render() { 
        var items = [];
        this.state.currentTweetList.map((item)=>{
            let id = item.tweet_id;
            
            items.push(<div key={id} className="twt-card mx-auto pd-auto"><Tweet tweetId = {id} ></Tweet></div>);
        });
        return (     
            
        <div  className="col-xs-12 col-sm-12 col-md-9 col-lg-6 col-xl-5 mx-auto tweet-area" >
                <MetaTags>
                <title>Viral Content</title>
                <meta name="description" content="Todays Viral Tweets" />
                <meta property="og:title" content="Onickle Follow The Unseen" />
                 {/*<meta property="og:image" content="path/to/image.jpg" />*/}
                </MetaTags>
                <InfiniteScroll
                    throttle={1000}
                    threshold={300}
                    hasMore={true}
                    onLoadMore={this.loadMore}
                    isLoading={this.state.loading}
            >
            {this.state.currentTweetList.map(item => <div key={item.tweet_id} className="twt-card mx-auto pd-auto"><Tweet tweetId = {item.tweet_id} ></Tweet></div>)} 
            </InfiniteScroll>
           
             {this.state.loading && (<Spinner></Spinner>)}

             

                
            { /* 
            this.state.currentTweetList.map((item)=>{

                   let id = item.tweet_id;
                    return <div key={id} className="twt-card mx-auto pd-auto">
                            
                            <Tweet tweetId = {id} ></Tweet>
                            
                            
                        </div>
                    })
                */}
                {/*this.state.loading ? <Spinner></Spinner> : true*/}
            </div>
            

        
        );
    }
}
 
export default Virals;