import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { VisionManager, LightLevel, LightSource, RangeEffect } from './pathfinder-lighting';
import { Point } from 'leaflet';


class TestData {
  static Torch : LightSource =  Object.assign (
    new LightSource(), {
      range: 20,
      rangeEffect : RangeEffect.SetNormal,
      dimRange: 40,
      dimRangeEffect: RangeEffect.Plus1UpToNormal,
      location : new Point(50, 50)
    })
}

describe('PathfinderLighting', () => {

  it('should get ambient', () => {
    const data = VisionManager.makeAmbient(LightLevel.Dim, 100, 100, 1)

    expect(data.length).toBe(100)
    expect(data[0].length).toBe(100)
    expect(data[0][0].length).toBe(3)
    expect(data[0][0][0]).toBe(LightLevel.Dim)
    expect(data[23][45][0]).toBe(LightLevel.Dim)
  });

  it('should get Normal with 1 torch', () => {
    const sources : LightSource[] = [TestData.Torch]
    const data = VisionManager.makeAmbient(LightLevel.Dim, 100, 100, 1)
    VisionManager.calcNormal(sources, 1, data)
    expect(data[49][49][1]).toBe(LightLevel.Normal)
  });



});
