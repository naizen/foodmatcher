import React, { useState } from 'react'
import { useSprings, animated, interpolate } from 'react-spring'
import { useGesture } from 'react-use-gesture'
import Card from './Card'
import DeckActions from './DeckActions'

// These two are just helpers, they curate spring data, values that are later being interpolated into css
const to = (i, current) => {
  return {
    x: 0,
    y: -50,
    scale: 1,
    rot: 0,
    delay: 0.2,
    shadow: i === current ? 1 : 0
  }
}
const from = i => ({ x: 0, rot: 0, scale: 1.5, y: -1000, shadow: 0 })
// This is being used down there in the view, it interpolates rotation and scale into a css transform
const trans = (r, s) =>
  `perspective(0px) rotateX(${r}deg) rotateY(${r /
    10}deg) rotateZ(${r}deg) scale(${s})`

function Deck({ places, addMatch, removeMatch }) {
  const [gone] = useState(() => new Set())
  const [current, setCurrent] = useState(places.length - 1)
  const [swipeDelta, setSwipeDelta] = useState(0)
  const [springs, setSprings] = useSprings(places.length, i => ({
    ...to(i, current),
    from: from(i)
  }))

  const refresh = () => {
    setCurrent(places.length - 1)
    setTimeout(
      () => gone.clear() || setSprings(i => to(i, places.length - 1)),
      600
    )
  }

  const swipeCard = (index, xDirection) => {
    gone.add(index)
    setCurrent(current - 1)
    setSprings(i => {
      if (current - 1 !== i) return
      return {
        shadow: 1
      }
    })

    if (xDirection === 1) {
      // Swipe right
      addMatch(places[index])
    } else {
      removeMatch(places[index])
    }

    setSprings(i => {
      if (index !== i) return
      const x = (200 + window.innerWidth) * xDirection
      const rot = -100 / 100 + xDirection * 10

      return {
        x,
        rot,
        delay: undefined,
        config: { friction: 50, tension: 200 }
      }
    })
  }

  // Create a gesture, we're interested in down-state, delta (current-pos - click-pos), direction and velocity
  const bind = useGesture(
    ({
      args: [index],
      down,
      delta: [xDelta, yDelta],
      distance,
      direction: [xDir, yDir],
      velocity
    }) => {
      //const yDirection = -1
      const xDirection = xDelta < 0 ? -1 : 1 // direction should point left or right
      const trigger = distance > 200
      let swipeDelta = 0

      if (xDelta < 0) {
        swipeDelta = -1
      } else if (xDelta > 0) {
        swipeDelta = 1
      }
      setSwipeDelta(swipeDelta)
      if (!down) {
        setSwipeDelta(0)
      }

      if (!down && trigger) {
        gone.add(index) // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out
        setCurrent(current - 1)
        setSprings(i => {
          if (current - 1 !== i) return
          return {
            shadow: 1
          }
        })

        if (xDirection === 1) {
          // Swiped right
          addMatch(places[index])
        } else {
          removeMatch(places[index])
        }
      }

      setSprings(i => {
        if (index !== i) return // We're only interested in changing spring-data for the current spring
        const isGone = gone.has(index)
        const x = isGone
          ? (200 + window.innerWidth) * xDirection
          : down
          ? xDelta
          : 0 // When a card is gone it flys out left or right, otherwise goes back to zero
        const rot =
          down || isGone
            ? xDelta / 100 + (isGone ? xDirection * 10 * velocity : 0)
            : 0
        // How much the card tilts, flicking it harder makes it rotate faster
        const scale = down ? 1.1 : 1 // Active cards lift up a bit
        return {
          x,
          rot,
          scale,
          delay: undefined,
          config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 }
        }
      })

      if (!down && gone.size === places.length) {
        refresh()
      }
    }
  )

  return (
    <div className="deck-container">
      {springs.map(({ x, y, rot, scale, shadow }, i) => (
        <animated.div
          className="deck"
          key={i}
          style={{
            transform: interpolate(
              [x, y],
              (x, y) => `translate3d(${x}px,${y}px,0)`
            )
          }}>
          {/* This is the card itself, we're binding our gesture to it (and inject its index so we know which is which) */}
          <Card
            x={x}
            bind={bind(i)}
            rot={rot}
            scale={scale}
            trans={trans}
            place={places[i]}
            shadow={shadow}
            swipeDelta={swipeDelta}
            isCurrent={current === i}
          />
        </animated.div>
      ))}
      <DeckActions refresh={refresh} current={current} swipeCard={swipeCard} />
    </div>
  )
}

export default Deck
