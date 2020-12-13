import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import styled from 'styled-components';
const ENDPOINT = "http://127.0.0.1:4021";

const Body = styled.div`
  padding: 25px;
`;

const Details = styled.div`
  opacity: ${props => (props.open ? "1" : "0")};
  max-height: ${props => (props.open ? "100%" : "0")};
  overflow: hidden;
  padding: ${props => (props.open ? "5px" : "0 5px")};
  transition: all 0.3s;
`;

const RecipeWrapper = styled.div`
  border: 1px solid #551111;
  padding: 5px 20px 10px;
  margin-bottom: 5px;
`;

const StepWrapper = styled.div`
  border-width: ${props => (props.selected) ? "1px" : 0};
  border-color: blue;
  border-style: solid;
  padding: 2px;
  margin-bottom: 5px;
`;

const DetailsContent = styled.div`
  margin: auto;
`;

const StepsWrapper = styled.div`
  float: left;
`;

const RecipePhoto = styled.div`
  border: 2px solid black;
  float: right;
  width: 200px;
  height: 200px;
  background-size: 200px 200px;
  background-image: url(${props => props.url})
`;

function Step({step, selected}) {
  return <StepWrapper selected={selected}> - {step} </StepWrapper>;
}

function Steps({steps, selectedStep}) {
  let counter = 0;
  const elements = steps.map((e) => <Step step={e} selected={counter == selectedStep} key={counter++}/>);
  return <div>
    {elements}
  </div>;
}

function Recipe({recipe, selected, selectedStep}) {
  return <RecipeWrapper>
    <h3>{recipe.name}</h3>
    <Details open={selected}>
      <span>{recipe.ingredients.join(', ')}</span>
      <DetailsContent>
        <StepsWrapper>
          <h4>Anleitung</h4>
          <Steps steps={recipe.steps} selectedStep={selectedStep} />
        </StepsWrapper>
        <RecipePhoto url={recipe.imageUrl} />
      </DetailsContent>
    </Details>
  </RecipeWrapper>;
}

function Recipes({recipes, selectedRecipe, selectedStep}) {
  if (!recipes || recipes.length == 0) {
    return null;
  }
  let counter = 0;
  const elements = recipes.map((v) => {
    counter++;
    return <Recipe
      key={counter}
      recipe={v}
      selected={v.name.toLowerCase() == selectedRecipe.toLowerCase()}
      selectedStep={selectedStep}
    />
  });
  return <div>
    {elements}
  </div>;
}

function App() {
  const [selectedRecipe, setSelectedRecipe] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [selectedStep, setSelectedStep] = useState(null);

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on('recipes', data => {
      if (data) {
        console.log(recipes);
        setRecipes(data);
      }
    })
    socket.on('selected', data => {
      if (data) {
        setSelectedRecipe(data);
      }
    });
    socket.on('selected-step', data => {
      if (data != null) {
        setSelectedStep(data);
      }
    });
  }, []);

  return (
    <Body>
      <h1>Ihre Lieblingsrezepte</h1>
      <Recipes recipes={recipes} selectedRecipe={selectedRecipe} selectedStep={selectedStep}/>
    </Body>
);
}

export default App;