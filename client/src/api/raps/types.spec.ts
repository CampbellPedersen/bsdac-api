import { EventName, getEventLabel } from "./types"

describe('getEventLabel', () => {
  it('gets label', () => {
    const label = getEventLabel({name: EventName.BSDAC, series: 1});

    expect(label).toEqual('BSDAC 1');
  })

  it('gets label for series 0', () => {
    const label = getEventLabel({name: EventName.CBB, series: 0});

    expect(label).toEqual("Cam's Birthday Bash");
  })
})