import React, { Component } from "react";

class EmojiCursor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      possibleEmoji: ["😀", "😍", "😆", "🥰"],
      cursor: { x: 0, y: 0 },
      particles: [],
    };
  }

  componentDidMount() {
    this.bindEvents();
    this.startAnimation();
  }

  componentWillUnmount() {
    this.removeEventListeners();
  }

  bindEvents() {
    document.addEventListener("mousemove", this.handleMouseMove);
    document.addEventListener("touchmove", this.handleTouchMove);
    document.addEventListener("touchstart", this.handleTouchMove);
  }

  removeEventListeners() {
    document.removeEventListener("mousemove", this.handleMouseMove);
    document.removeEventListener("touchmove", this.handleTouchMove);
    document.removeEventListener("touchstart", this.handleTouchMove);
  }

  handleTouchMove = (e) => {
    if (e.touches.length > 0) {
      for (let i = 0; i < e.touches.length; i++) {
        this.addParticle(
          e.touches[i].clientX,
          e.touches[i].clientY,
          this.getRandomEmoji()
        );
      }
    }
  };

  handleMouseMove = (e) => {
    this.setState({
      cursor: { x: e.clientX, y: e.clientY },
    });

    this.addParticle(e.clientX, e.clientY, this.getRandomEmoji());
  };

  getRandomEmoji() {
    const { possibleEmoji } = this.state;
    return possibleEmoji[Math.floor(Math.random() * possibleEmoji.length)];
  }

  addParticle(x, y, character) {
    const particle = {
      lifeSpan: 120,
      velocity: {
        x: (Math.random() < 0.5 ? -1 : 1) * (Math.random() / 2),
        y: 1,
      },
      position: { x: x - 10, y: y - 20 },
      character: character,
    };

    this.setState((prevState) => ({
      particles: [...prevState.particles, particle],
    }));
  }

  updateParticles() {
    this.setState((prevState) => ({
      particles: prevState.particles
        .map((particle) => ({
          ...particle,
          position: {
            x: particle.position.x + particle.velocity.x,
            y: particle.position.y + particle.velocity.y,
          },
          lifeSpan: particle.lifeSpan - 1,
        }))
        .filter((particle) => particle.lifeSpan >= 0),
    }));
  }

  startAnimation = () => {
    requestAnimationFrame(this.startAnimation);
    this.updateParticles();
  };

  render() {
    const { particles } = this.state;

    return (
      <div className="ec">
        {particles.map((particle, index) => (
          <span
            key={index}
            style={{
              position: "absolute",
              display: "block",
              pointerEvents: "none",
              zIndex: "10000000",
              fontSize: "23px",
              transform: `translate3d(${particle.position.x}px, ${
                particle.position.y
              }px, 0) scale(${particle.lifeSpan / 120})`,
            }}
          >
            {particle.character}
          </span>
        ))}
      </div>
    );
  }
}

export default EmojiCursor;
