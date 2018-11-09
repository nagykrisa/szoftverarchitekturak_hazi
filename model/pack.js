exports.Packs = class Packs{
  constructor( id, name, from, to, mass, volume, deadline){
    this.id = id;
    this.name = name;
    this.from = from;
    this.to = to;
    this.mass = mass;
    this.volume = volume;
    this.deadline = deadline;
  }
}