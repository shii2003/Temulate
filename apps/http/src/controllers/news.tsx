import React, { Component } from "react";
import Newsitems from "./Newsitems";
import PropTypes from 'prop-types'
import Spinner from "./Spinner";


export default class News extends Component {
  //   articles = [
  //     {
  //       source: {
  //         id: "techcrunch",
  //         name: "TechCrunch",
  //       },
  //       author: "Haje Jan Kamps",
  //       title: "How Gear Patrol acquired DPReview from Amazon | TechCrunch",
  //       description:
  //         "DPReview and Gear Patrol are different boats, rowing in the same direction toward better products and product knowledge for enthusiasts.",
  //       url: "https://techcrunch.com/2023/07/23/slowissmoothandsmoothisfast/",
  //       urlToImage:
  //         "https://techcrunch.com/wp-content/uploads/2023/07/DSC09768-Edit.jpg?resize=1200,675",
  //       publishedAt: "20230723T06:47:52Z",
  //       content:
  //         "In March, DPReview announced that parent company Amazon was shutting it down, and the photography world entered a dual state of shock and disbelief.\r\nFor 25 years, DPReview had served as a consistent… [+2187 chars]",
  //     },
  //     {
  //       source: {
  //         id: "techcrunch",
  //         name: "TechCrunch",
  //       },
  //       author: "Mary Ann Azevedo and Christine Hall",
  //       title:
  //         "FedNow may finally be live, but will it be too costly for businesses to adopt? | TechCrunch",
  //       description:
  //         "The U.S. was behind in launching a federal instant payments system compared to several other countries around the world.",
  //       url: "https://techcrunch.com/2023/07/23/fednowmayfinallybelivebutwillitbetoocostlyforbusinessestoadopt/",
  //       urlToImage:
  //         "https://techcrunch.com/wp-content/uploads/2023/07/GettyImages-1415313623.jpg?resize=1200,800",
  //       publishedAt: "20230722T02:27:20Z",
  //       content:
  //         "Welcome to The Interchange! If you want this in your inbox, sign up here. It was an eventfilled week in the fintech world, what with FedNow launching, the former CEO of fintech Bolt — and the compan… [+9527 chars]",
  //     },
  //     {
  //       source: {
  //         id: "techcrunch",
  //         name: "TechCrunch",
  //       },
  //       author: "Rebecca Szkutak",
  //       title:
  //         "Futureverse is a metaverse company that might actually get it | TechCrunch",
  //       description:
  //         "Futureverse is making tools that brands can use to build content for the metaverse, but not the one that Meta is envisioning.",
  //       url: "https://techcrunch.com/2023/07/22/futureversemetaversefundraise/",
  //       urlToImage:
  //         "https://techcrunch.com/wp-content/uploads/2023/07/GettyImages-1412442269.jpg?resize=1200,849",
  //       publishedAt: "20230722T00:30:32Z",
  //       content:
  //         "Startups that look to improve an industry’s outdated infrastructure are definitely welcome in sectors like financial services and healthcare. But why would a company build infrastructure for an indus… [+1716 chars]",
  //     },
  //     {
  //       source: {
  //         id: "techcrunch",
  //         name: "TechCrunch",
  //       },
  //       author: "Alyssa Stringer",
  //       title:
  //         "This week in robotics: Chinese startups net a series of fundraising successes | TechCrunch",
  //       description:
  //         "A range of robotics companies based in China, tackling everything from food prep to deliveries and supply chain logistics, announced new fundraising this week.",
  //       url: "https://techcrunch.com/2023/07/22/thisweekinroboticschinesestartupsnetaseriesoffundraisingsuccesses/",
  //       urlToImage:
  //         "https://techcrunch.com/wp-content/uploads/2023/07/rice-robotics-yt-commercial.png?w=1200",
  //       publishedAt: "20230722T00:10:16Z",
  //       content:
  //         "Before we dive into this weeks biggest news within the robotics space, there’s an announcement of our own to highlight.\r\nWell be hosting a number of robotics industry experts at our very first Hardwa… [+3460 chars]",
  //     },
  //     {
  //       source: {
  //         id: "techcrunch",
  //         name: "TechCrunch",
  //       },
  //       author: "Kyle Wiggers",
  //       title:
  //         "An AIgenerated 'South Park' episode, Microsoft's security woes, and Tesla's first Cybertruck build | TechCrunch",
  //       description:
  //         "In this edition of Week in Review, we cover the AIgenerated \"South Park\" episode, Microsoft's security woes and Tesla's first Cybertruck build.",
  //       url: "https://techcrunch.com/2023/07/22/aigeneratedsouthparkepisodesmicrosoftssecuritywoesandteslasfirstcybertruckbuild/",
  //       urlToImage:
  //         "https://techcrunch.com/wp-content/uploads/2023/07/Cybertruck_78.jpg?resize=1200,800",
  //       publishedAt: "20230721T22:24:20Z",
  //       content:
  //         "Hey, folks, welcome to Week in Review (WiR), TechCrunchs regular roundup of the past week in tech. Too busy to check the headlines this week? Don’t sweat it. That’s why WiR exists — we’ll get you cau… [+6104 chars]",
  //     },
  //     {
  //       source: {
  //         id: "techcrunch",
  //         name: "TechCrunch",
  //       },
  //       author: "Devin Coldewey",
  //       title:
  //         "ChatGPT comes to Android next week, but you can sign up today | TechCrunch",
  //       description:
  //         'Two months after launching for iOS, ChatGPT is available to "preorder" for Android users who want to take the ubiquitous chatbot on the go.',
  //       url: "https://techcrunch.com/2023/07/21/chatgptcomestoandroidnextweekbutyoucansignuptoday/",
  //       urlToImage:
  //         "https://techcrunch.com/wp-content/uploads/2023/07/chatgpt-android.jpg?resize=1200,564",
  //       publishedAt: "20230721T21:18:32Z",
  //       content:
  //         "Two months after launching for iOS, ChatGPT is available to “preorder” for Android users who want to take the ubiquitous chatbot on the go. If it’s anywhere as popular as the iPhone version, expect … [+1361 chars]",
  //     },
  //     {
  //       source: {
  //         id: "techcrunch",
  //         name: "TechCrunch",
  //       },
  //       author: "Christine Hall",
  //       title: "Bolt, exCEO Ryan Breslow subject of SEC probe | TechCrunch",
  //       description:
  //         "The SEC is reportedly investigating whether federal securities laws were violated in connection with statements made when Bolt was raising money in 2021.",
  //       url: "https://techcrunch.com/2023/07/21/boltexceoryanbreslowsubjectofsecprobe/",
  //       urlToImage:
  //         "https://techcrunch.com/wp-content/uploads/2022/01/Headshot_Ryan-Breslow-e1651272133788.jpg?w=1200",
  //       publishedAt: "20230721T21:15:26Z",
  //       content:
  //         "Ryan Breslow, cofounder of the ecommerce software outfit Bolt, was subpoenaed along with the company last year by the U.S Securities and Exchange Commission. The Information reported the news first … [+4286 chars]",
  //     },
  //     {
  //       source: {
  //         id: "techcrunch",
  //         name: "TechCrunch",
  //       },
  //       author: "Anna Heim",
  //       title: "Reining in API sprawl | TechCrunch",
  //       description:
  //         "Large companies with over 5,000 developers struggle with API sprawl, according to a recent Postman survey.",
  //       url: "https://techcrunch.com/2023/07/22/apisprawlpostmanreport/",
  //       urlToImage:
  //         "https://techcrunch.com/wp-content/uploads/2021/12/GettyImages-1142274453.jpg?resize=1200,912",
  //       publishedAt: "20230721T21:00:05Z",
  //       content:
  //         "Welcome to the TechCrunch Exchange, a weekly startupsandmarkets newsletter. Its inspired by the daily TechCrunch+ column where it gets its name. Want it in your inbox every Saturday? Sign up here.\r… [+1835 chars]",
  //     },
  //     {
  //       source: {
  //         id: "techcrunch",
  //         name: "TechCrunch",
  //       },
  //       author: "Kyle Wiggers",
  //       title:
  //         "This week in AI: Companies voluntarily submit to AI guidelines — for now | TechCrunch",
  //       description:
  //         "This Week in AI, we've got White House visits, generative TV, dog simulation, and authors protesting largescale digestion of their works.",
  //       url: "https://techcrunch.com/2023/07/22/thisweekinaicompaniesvoluntarilysubmittoaiguidelinesfornow/",
  //       urlToImage:
  //         "https://techcrunch.com/wp-content/uploads/2019/08/GettyImages-74063406.jpg?resize=1200,803",
  //       publishedAt: "20230721T20:39:34Z",
  //       content:
  //         "Keeping up with an industry as fastmoving as AI is a tall order. So until an AI can do it for you, heres a handy roundup of recent stories in the world of machine learning, along with notable resear… [+8275 chars]",
  //     },
  //     {
  //       source: {
  //         id: "techcrunch",
  //         name: "TechCrunch",
  //       },
  //       author: "Erel Margalit",
  //       title: "Tech warriors in the battle for Israel’s democracy | TechCrunch",
  //       description:
  //         "Israel's hightech sector stands united in its commitment to safeguard the democratic values that have propelled success on the global stage.",
  //       url: "https://techcrunch.com/2023/07/22/techwarriorsinthebattleforisraelsdemocracy/",
  //       urlToImage:
  //         "https://techcrunch.com/wp-content/uploads/2023/07/GettyImages-1554257766.jpg?w=1024",
  //       publishedAt: "20230721T19:52:16Z",
  //       content:
  //         "Israel is a country that has battled for its existence and survival since Day 1.\r\nHaving fought multiple wars and living with ongoing threats, Israelis are now in a fierce battle for their democracy.… [+4952 chars]",
  //     },
  //   ];

  articles = []


  // defaultProps
  // defaultProps is a way to specify default values for props. If a prop is not provided by the parent component, the default value will be used. This is particularly useful for ensuring that a component has all the necessary props it needs to function properly, even if some are not explicitly provided.


  static defaultProps = {
    country: "in",
    pageSize: 9,
    category: "technology"
  }

  // propTypes
  // propTypes is used for type-checking props to ensure that the correct type of props is passed to the component. This helps in catching bugs and providing a clear contract for the component’s expected properties. propTypes is often used during development for validation purposes.

  static propTypes = {
    country: PropTypes.string.isRequired,
    pageSize: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired
  }


  constructor(prop) {
    super();
    console.log(" i am a constructor");
    this.state = {
      articles: [],
      loading: false,
      page: 0,
      totalResults: 0,

    };
  }



  //   In React, componentDidMount is a lifecycle method that is called after a component has been rendered to the DOM. This method is part of the class component lifecycle in React and is typically used for tasks that require the component to be fully loaded before executing, such as:

  // Fetching Data: Making API calls to fetch data that the component needs to display.
  // Subscriptions: Setting up subscriptions or event listeners.
  // DOM Manipulations: Directly interacting with the DOM, like integrating with third-party libraries that manipulate the DOM.

  async componentDidMount() {
    {
      this.setState({
        loading: true
      })
    }
    let url = https://newsapi.org/v2/top-headlines?country=us&apiKey=34444f5ad6954f93a2a2735cb85c21c8

      let data = await fetch(url)
    let parsedData = await data.json();

    this.setState({
      articles: parsedData.articles,
      totalResults: parsedData.totalResults,
      loading: false

    });
  }



  handleNext = async () => {
    {
      this.setState({
        loading: true
      })
    }

    let url = https://newsapi.org/v2/top-headlines?country=us&apiKey=34444f5ad6954f93a2a2735cb85c21c8
      let data = await fetch(url)
    let parsedData = await data.json();

    this.setState({
      page: this.state.page + 1,
      articles: parsedData.articles,
      loading: false
    });
  }

  handlePrev = async () => {
    {
      this.setState({
        loading: true
      })
    }

    let url = https://newsapi.org/v2/top-headlines?country=us&apiKey=34444f5ad6954f93a2a2735cb85c21c8
      let data = await fetch(url)
    let parsedData = await data.json();

    this.setState({
      page: this.state.page - 1,
      articles: parsedData.articles,
      loading: false
    });
  }


  render() {
    return (
      <>
        <h1 className="text-center text-danger">Live News</h1>

        {this.state.loading && <Spinner />}

        <div className="container">
          <div className="row">
            {this.state.articles.map((element) => {
              return (
                <div className="col-md-4" key={element.url}>
                  <Newsitems
                    title={element.title}
                    description={element.description}
                    url={element.urlToImage}
                    linkUrl={element.url}
                    author={element.author}
                    date={element.publishedAt}
                    source={element.source.name}
                  />
                </div>
              );
            })}
          </div>


          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <button className="btn btn-danger me-md-2" type="button" onClick={this.handlePrev} disabled={this.state.page <= 1}>&laquo;Prev</button>
            <button className="btn btn-danger" type="button" onClick={this.handleNext} >Next &raquo;</button>
          </div>

          <br />




        </div>
      </>
    );
  }
}