import React from 'react'
import Star from '@material-ui/icons/Star'
import StarHalf from '@material-ui/icons/StarHalf'
import StarBorder from '@material-ui/icons/StarBorder'

function ReviewStars({ rating, reviewCount, yelpUrl }) {
  const wholeRating = Math.floor(rating)
  let remainder = rating % wholeRating
  remainder = Number(remainder.toFixed(2))
  let starHalf = false
  let remainingStars = 5 - wholeRating

  if (remainder >= 0.5) {
    starHalf = true
    remainingStars--
  }

  let wholeStars = []
  let remainingStarsArr = []

  for (let i = 0; i < wholeRating; i++) {
    wholeStars.push(i)
  }

  for (let i = 0; i < remainingStars; i++) {
    remainingStarsArr.push(i)
  }

  return (
    <div className="review-stars">
      <a href={yelpUrl} target="_blank" rel="noopener noreferrer">
        <span>{rating}</span>
        <span>
          {wholeStars.map(i => (
            <Star key={i} fontSize="small" />
          ))}
          {starHalf ? <StarHalf fontSize="small" /> : null}
          {remainingStarsArr.map(i => (
            <StarBorder fontSize="small" key={i} />
          ))}
        </span>
        <span>({reviewCount})</span>
      </a>
    </div>
  )
}

export default React.memo(ReviewStars)
