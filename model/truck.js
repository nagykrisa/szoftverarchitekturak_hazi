exports.Truck = class Truck{
  constructor( id,current_location,speed_max,volume_max,load_max){
    this.id = id;
    this.current_location = current_location;
    this.speed_max = speed_max;
    this.volume_max = volume_max;
    this.load_max = load_max;
  }
}