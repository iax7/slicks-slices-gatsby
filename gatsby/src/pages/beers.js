import React from 'react';
import { graphql } from 'gatsby';
import styled from 'styled-components';

const BeerGridStyles = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
`;

const SingleBeerStyles = styled.div`
  border: 1px solid var(--grey);
  padding: 2rem;
  text-align: center;
  img {
    width: 100%;
    height: 200px;
    object-fit: contain;
    display: grid;
    align-items: center;
    font-size: 10px;
  }
`;

function Beer({ beer }) {
  const rating = Math.round(beer.rating.average);
  return (
    <SingleBeerStyles>
      <img src={beer.image} alt={beer.name} />
      <h3>{beer.name}</h3>
      {beer.price}
      <p title={`${rating} out of 5 stars`}>
        {`⭐️`.repeat(rating)}
        <span style={{ filter: `grayscale(100%)` }}>
          {`⭐️`.repeat(5 - rating)}
        </span>
      </p>
    </SingleBeerStyles>
  );
}

export default function BeersPage({ data }) {
  const beers = data.beers.nodes;

  return (
    <>
      <h2 className="center">
        We have {beers.length} beers available. Dine in Only!
      </h2>
      <BeerGridStyles>
        {beers.map((beer) => (
          <Beer key={beer.id} beer={beer} />
        ))}
      </BeerGridStyles>
    </>
  );
}

// https://www.gatsbyjs.com/docs/tutorial/part-five/#build-a-page-with-a-graphql-query
export const query = graphql`
  query {
    beers: allBeer {
      nodes {
        id
        name
        price
        image
        rating {
          reviews
          average
        }
      }
    }
  }
`;
