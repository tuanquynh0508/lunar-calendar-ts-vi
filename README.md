# lunar-calendar-ts-vi
Lunar Calendar Typescript Library for Vietnamese

## Introduction
- Base on javascript library of Ho Ngoc Duc [https://www.informatik.uni-leipzig.de/~duc/] 

## Install
```
npm i lunar-calendar-ts-vi
```

## Usage
### Basic
```
import { Lunar, BlockLunarDate } from 'lunar-calendar-ts-vi';
...

export class Demo {
  lunarDate!: BlockLunarDate;
    
  constructor() {
    const lunar: Lunar = new Lunar();
    // Get today
    this.lunarDate = lunar.getBlockLunarToday();
    // Or
    this.lunarDate = lunar.getBlockLunarDate(new Date());
    
    console.log(this.lunarDate);
  }
}
```

### Convert Solar to Lunar
```
import { Lunar, BlockLunarDate } from 'lunar-calendar-ts-vi';
...

export class Demo {
  lunarDate!: BlockLunarDate;
    
  constructor() {
    const lunar: Lunar = new Lunar();
    this.lunarDate = lunar.getBlockLunarDate('1984-08-22');
    
    console.log(this.lunarDate);
  }
}
```

### Get list date og month
```
import { Lunar, BlockLunarDate, LunarDate } from 'lunar-calendar-ts-vi';
...

export class Demo {

  constructor() {
    const lunar: Lunar = new Lunar();
    const lunarDateOfMonth: LunarDate[] = lunar.getMonth(2, 2021);
    
    console.log(lunarDateOfMonth);
  }
}
```
