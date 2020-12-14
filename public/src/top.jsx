import React, { Component } from 'react';
import { Tweet } from 'react-twitter-widgets'
import Spinner from './Spinner'
//import InfiniteScroll from 'react-infinite-scroller';
import { InfiniteScroll } from 'react-simple-infinite-scroll'
import MetaTags from 'react-meta-tags';

/*import {TwitterVideoEmbed,TwitterTweetEmbed}  from 'react-twitter-embed';*/
const LOADING_BATCH_SIZE = 5;

class TopUSA extends Component {

    getTopData = async() => {
        //this.setState({loading:true});
        let tweetListesi = [];
        try {
            
            const response = await fetch("https://twt-server.herokuapp.com/topDatas");
            const jsonData = await response.json();
            
            this.setState({currentTweet:jsonData,hasMention:false,loading:false,currentTweetList:jsonData.slice(0,LOADING_BATCH_SIZE),page:2});
            
        } catch (err) {
            console.error(err.message);
        }
       
    }
    loadMore = async() => {
        this.setState({loading:true});
       
        try {
            
            const response = await fetch("https://twt-server.herokuapp.com/topDatas/"+this.state.page);
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
        this.getTopData = this.getTopData.bind(this);
        this.loadMore = this.loadMore.bind(this);
        
        
        
        
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
           
        
        
    }

    componentDidMount(){
        this.getTopData();
       /* window.addEventListener('scroll', () => {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                this.loadMore();
                
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
             
        <div className="col-xs-12 col-sm-12 col-md-9 col-lg-6 col-xl-5 mx-auto tweet-area" >
                <MetaTags>
                <title>Top Shared Content</title>
                <meta name="description" content="USA Top Shared Tweets" />
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
 
export default TopUSA;