import React from "react";
import "./CoronaRect.css";

export default class CoronaRect extends React.Component {
    entitiesAmount = 100;
    startInfectedAmount = 10;
    fps = 60;

    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
    }

    componentDidMount() {
        this.ctx = this.canvasRef.current.getContext('2d');
        this.spawnEntities();
        setInterval(() => {
            this.tick();
        }, 1000 / this.fps);
    }

    spawnEntities = () => {
        this.entities = [];
        for(let i = 0; i < this.entitiesAmount; i++) {
            this.entities.push(new Entity(this.props.width, this.props.height, i, i < this.startInfectedAmount, this.getEntities));
        }
    };

    getEntities = () => {
        return this.entities;
    };

    tick = () => {
        this.ctx.clearRect(0, 0, this.props.width, this.props.height);
        this.entities.map(entity => entity.tick(this.ctx));
    };

    render() {
        return <canvas ref={this.canvasRef} width={this.props.width} height={this.props.height} className={"corona-rect"}/>
    }
}

class Entity {
    /*
    Possible states are the following:
        - Susceptible (Default start)
            Not infected and could catch the disease
        Infected
            Is infected and can infect susceptible entites
        Removed
            Is either dead or immune. Can't infect others or catch the disease
     */
    static speed = 2;
    static ballRadius = 7.5;
    static coughRadius = 25;
    static infectionChancePerTick = 0.05;
    static infectionTime = 24 * 25; // Time till removal

    infectedTime = 0; // Time in tick how long this has been infected
    tickCount = 0;

    constructor(maxX, maxY, id, infected, getEntities) {
        this.x = getRandomArbitrary(10, maxX - 10);
        this.y = getRandomArbitrary(10, maxX - 10);
        this.id = id;
        this.maxX = maxX;
        this.maxY = maxY;
        this.dx = getRandomArbitrary(-1, 1) * Entity.speed;
        this.dy = getRandomArbitrary(-1, 1) * Entity.speed;
        this.state = infected ? "Infected" : "Susceptible";
        this.getEntities = getEntities;
    }

    tick(ctx) {
        this.tickCount += 1;
        this.move();
        this.draw(ctx);

        if(this.state == "Infected") {
            this.infectedTime += 1;
            if(this.infectedTime >= Entity.infectionTime) {
                this.state = "Removed";
            }

            this.getEntities().forEach((entity) => {
                if(entity.distance(this) <= Entity.coughRadius && Math.random() <= Entity.infectionChancePerTick) {
                    entity.state = "Infected";
                }
            });
        }
    }

    move() {
        if(this.x + this.dx > this.maxX - Entity.ballRadius || this.x + this.dx < Entity.ballRadius) {
            this.dx = -this.dx;
        }
        if(this.y + this.dy > this.maxY - Entity.ballRadius || this.y + this.dy < Entity.ballRadius) {
            this.dy = -this.dy;
        }
        this.x += this.dx;
        this.y += this.dy;
    }

    draw(ctx) {
        let ballColor;

        switch (this.state) {
            case "Susceptible":
                ballColor = "#00ff00";
                break;
            case "Infected":
                ctx.beginPath();
                ctx.arc(this.x, this.y, Entity.coughRadius, 0, 2 * Math.PI);
                ctx.fillStyle = "rgba(255,0,0,0.1)";
                ctx.fill();
                ctx.stroke();
                ballColor= "#ff0000";
                break;
            case "Removed":
                ballColor = "#5c5c5c";
                break;
            default:
                break;
        }

        ctx.beginPath();
        ctx.fillStyle = ballColor;
        ctx.arc(this.x, this.y, Entity.ballRadius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }

    distance(otherEntity) {
        return Math.hypot(otherEntity.x - this.x, otherEntity.y - this.y);
    }
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}