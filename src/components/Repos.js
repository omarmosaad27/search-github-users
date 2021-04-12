import React from 'react';
import styled from 'styled-components';
import { GithubContext } from '../context/context';
import { ExampleChart, Pie3D, Column3D, Bar3D, Doughnut2D } from './Charts';
const Repos = () => {
  const {repos} = React.useContext(GithubContext);
  // iterate over the repos array 
  const languages = repos.reduce(( total, item )=>{
    // destructure the language out of the data
        const { language, stargazers_count } = item
        // check if the proprety is null or if it is not null retun total 
        if(!language){
          return total
        }
        // check if the object that i returned have the language property
        if(!total[language]){
          // if it does not has the proprety i created one object have label and value : 1
          total[language] = {
            label:language,
            value:1,
            stars:stargazers_count
          }
        }else{
          // if the language is there keep the same proprety  then ...
          total[language] = {
            // copy the values that the objcets currently have in it
            ...total[language],
            // get me what is the current value 
            value:total[language].value + 1,
            // get the stars of the project
            stars:total[language].stars + stargazers_count
          };
        }
        // must returned to reduce work
        return total
  },{})
  
  // since i would want have as an array i need to use object.values 
  const mostUsed = Object.values(languages)
  // i want to sort the values based on the heighest
  .sort((a,b)=>{
    return b.value - a.value
  })
  // and always i want to display 5 languages 
  .slice(0,5)
  console.log(languages);

  // most stars for the languages
  const mostPopular = Object.values(languages).sort((a,b)=>{
    return b.stars - a.stars
  }).map((item)=>{
    return {...item , value:item.stars}
  }).slice(0,5) 

  // stars and forks
  // itterate over repos to get stars and forks
  let {stars,forks} = repos.reduce((total, item)=>{
    // destructure from item 
    const {stargazers_count, name, forks} = item
    // making new value of stars and return object with nam and value
    total.stars[stargazers_count] = {label:name, value:stargazers_count}
    // making new value of forks and return object with nam and value
    total.forks[forks] = {label:name, value:forks}
    return total
  },{
    // empty object for stars and forks to add on them
    stars:{},
    forks:{},
  })
  // since i have stars i want just 5 repos 
  stars = Object.values(stars).slice(-5).reverse()
  forks = Object.values(forks).slice(-5).reverse()
  console.log(stars);
  
  return (
    <section className="section">
      <Wrapper className="section-center">
        {/* <ExampleChart data={chartData}/> */}
        <Pie3D data={mostUsed}/>
        <Column3D data={stars}/>
        <Doughnut2D data={mostPopular}/>
        <Bar3D data={forks}/>
      </Wrapper>
    </section>
  )
};

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`;

export default Repos;
