import React, { useState} from 'react'
import {LineChart, Line, CartesianGrid, YAxis,XAxis, Tooltip, Legend,}  from 'recharts';
import { hilbertTransform } from 'hilbert_transform';

const PM = () => {

    // const { pymport, proxify } = require('pymport');
    // const np = proxify(pymport('numpy'));
    // var plot = require('plotter').plot;
    // var ndarray = require("ndarray")
    // var unwrap = require("phase-unwrap")
    var { jStat } = require('jstat');
    var unwrap = require("unwrap-phases")
    var ft = require('fourier-transform');
    const [frequency, setfrequency] = useState(1024);
    const [Amplitude, setAmplitude] = useState(1);
    const [Minn, setMinn] = useState(0);
    const [Maxn, setMaxn] = useState(0);
    const [frequencyMod, setfrequencyMod] = useState(64);
    const [AmplitudeMod, setAmplitudeMod] = useState(1);

    var size=1024;
    var x=new Array(size);
    var waveform=new Array(size);
    var waveform2=new Array(size);
    var waveform3=new Array(size);
    var noise=new Array(size);
    var width=1200;
    var height=150;
      var sampleRate;
    if(frequency<=1024)
      sampleRate=4096;
    else
      sampleRate=8192;
    var xd=new Array(size/2);
    var cos=new Array(5);

 for (let i = 0; i<size; i++) 
  {
   waveform[i] = Amplitude*Math.sin(frequency * Math.PI * 2 * (i / sampleRate));
  x[i]=i;
  }

  for (let i = 0; i<size; i++) 
  {
   waveform2[i] = AmplitudeMod*Math.sin(frequencyMod * Math.PI * 2 * (i / sampleRate));
  }
    
    var data=x.map((x,index)=>{
      let xObject ={};
      xObject.x=x;
      xObject.Amplitude=waveform[index];
      xObject.Amplitude2=waveform2[index];
      return xObject;
    })


  for (let i = 0; i<size; i++) 
  {
   waveform3[i] = Math.cos(2 * Math.PI *frequency * (i / sampleRate)+AmplitudeMod*Math.sin(frequencyMod * Math.PI * 2 * (i / sampleRate)))
  }


        var data2=x.map((x,index)=>{
      let xObject ={};
      xObject.x=x;
      xObject.Amplitude=waveform3[index];
      return xObject;
    })


    //szum
      for (let i = 0; i<size; i++) 
      {
       var n=Math.random()
        var sign=Math.random()
        if(sign>0.5)
        n=Minn+(n*Maxn)
        else
        n=Minn-(n*Maxn)
        noise[i]=waveform3[i]+n;
      }
       var NoiseDisplay=x.map((x,index)=>{
      let xObject ={};
      xObject.x=x;
      xObject.Amplitude=noise[index];
      return xObject;
    })
    //demodulacja
      // const t = np.arange(int(size));
      // m_t = AmplitudeMod*np.sin(2*Math.PI*frequencyMod*t);
      // x = np.cos(2*PI*fc*t + m_t );
      var offsetTerm =new Array(size);
      var demodulated=new Array(size);
      var instant_phase=new Array(size);
      var z=hilbertTransform(noise);
        for (let i = 0; i<size; i++) 
      {
      z[i]=Math.atan2(z[i],noise[i]);
      }
      var unwraped=unwrap(z)
  for (let i = 0; i<size; i++) 
  {
    offsetTerm[i] = frequency * Math.PI * 2 * (i / sampleRate)
    demodulated[i] = unwraped[i] - offsetTerm[i];
  }

      var demodulatedDisplay=x.map((x,index)=>{
      let xObject ={};
      xObject.x=x;
      xObject.Amplitude=demodulated[index];
      return xObject;
    })


    //Widma

  for (let i = 0; i<size/2; i++) 
  {
  xd[i]=(i+1)*sampleRate/size;
  }
    var spectrum = ft(waveform2);
    var spectrumCarrier = ft(waveform);
      var spectrumDisplay=xd.map((xd,index)=>{
      let xObject ={};
      xObject.x=xd;
      xObject.Amplitude=spectrum[index];
      xObject.Amplitude2=spectrumCarrier[index];
      return xObject;
    })

    var spectrum2 = ft(waveform3);
      var spectrumDisplay2=xd.map((xd,index)=>{
      let xObject ={};
      xObject.x=xd;
      xObject.Amplitude=spectrum2[index];
      return xObject;
    })

      var spectrum3 = ft(demodulated);
       spectrum3[0]=0;
      var spectrumDisplay3=xd.map((xd,index)=>{
      let xObject ={};
      xObject.x=xd;
      xObject.Amplitude=spectrum3[index];
      return xObject;
    })

  return(
    
<>
<div className="titlePage"><h2>Phase Modulation / Modulacja Fazy</h2></div>
<div className="sliders" >
  <form>
    <h2>Carrier signal / Sygnał nośny</h2>
      <input type="range" id="frequency" name="frequency" value={frequency}
        min="512" max="1920" step="128" onChange={e=>(setfrequency)(e.target.value)} />
          <label htmlFor="frequency">Frequency / Częstotliwość: {frequency}  </label>
    <p></p>
   <h2>Modulating signal / Sygnał modulujący</h2>
      <input type="range" id="frequency" name="frequency" value={frequencyMod}
         min="16" max="160" step="16" onChange={e=>(setfrequencyMod)(e.target.value)}/>
          <label htmlFor="frequency">Frequency / Częstotliwość: {frequencyMod} </label>
          <p></p>
                {/* <input type="range" id="ModulationIndex" name="ModulationIndex" value={ModulationIndex}
         min="1" max="10" step="1" onChange={e=>(setModulationIndex)(e.target.value)}/>
          <label htmlFor="ModulationIndex">Modulation index: {ModulationIndex}</label> */}
          <input type="range" id="Amplitude" name="Amplitude" value={AmplitudeMod}
         min="1" max="10" step="1" onChange={e=>(setAmplitudeMod)(e.target.value)}/>
          <label htmlFor="Amplitude">Amplitude / Amplituda: {AmplitudeMod}</label>
          <p></p>
       <h2>Noise / Szum</h2>
      {/* <input type="range" id="Minn" name="Minn" value={Minn}
         min="0" max="1" step="0.1" onChange={e=>(setMinn)(e.target.value)} />
          <label htmlFor="Minn">Min noise/Min szum: {Minn}</label>
          <p></p> */}
      <input type="range" id="Minn" name="Minn" value={Maxn}
         min="0" max="0.1" step="0.01" onChange={e=>(setMaxn)(e.target.value)} />
          <label htmlFor="Maxn">Value / Wartość: {Maxn}</label>

  </form>
</div>
<div className="charts">


<LineChart  width={width} height={height} data={data}>
  <CartesianGrid stroke="#ccc" />
  <YAxis dataKey="Amplitude2" />
  <Tooltip />
  <Legend/>
  <Line name="Modulating signal/Sygnał modulujący" dot={false} type="monotone" dataKey="Amplitude2" stroke="	#228B22" />
  <Line name="Carrier signal/Sygnał nośny" dot={false} type="monotone" dataKey="Amplitude" stroke="#8884d8" />
</LineChart>


      <LineChart  width={width} height={height} data={spectrumDisplay}>
        <YAxis dataKey="Amplitude" />
                  <XAxis dataKey="x" 
          domain={[0, sampleRate/2]}
          tickCount={7}
          type="number" ticks={[sampleRate/64*2,sampleRate/64*4,sampleRate/64*6,sampleRate/64*8,sampleRate/64*10,sampleRate/64*12,sampleRate/64*14,
          sampleRate/64*16,sampleRate/64*18,sampleRate/64*20,sampleRate/64*22,sampleRate/64*24,sampleRate/64*26,sampleRate/64*28,sampleRate/64*30,sampleRate/64*32]}/>
    <CartesianGrid stroke="#ccc" />
    <Tooltip />
    <Legend/>
    <Line name="Modulating signal spectrum/Widmo sygnału modulującego" dot={false} type="monotone" dataKey="Amplitude" stroke="#ff0000" />
    <Line name="Carrier signal spectrum/Widmo sygnału nośnego" dot={false} type="monotone" dataKey="Amplitude2" stroke="orange" />
  </LineChart>

        <LineChart  width={width} height={height} data={data2}>
        <YAxis dataKey="Amplitude" />
    <CartesianGrid stroke="#ccc" />
    <Tooltip />
    <Legend/>
    <Line name="Modulated Carrier/Zmodyfikowany sygnał nośny" dot={false} type="monotone" dataKey="Amplitude" stroke="#8884d8" />
  </LineChart>

       <LineChart  width={width} height={height} data={spectrumDisplay2}>
        <YAxis dataKey="Amplitude" />
                  <XAxis dataKey="x" 
          domain={[0, sampleRate/2]}
          tickCount={7}
          type="number" ticks={[sampleRate/64*2,sampleRate/64*4,sampleRate/64*6,sampleRate/64*8,sampleRate/64*10,sampleRate/64*12,sampleRate/64*14,
          sampleRate/64*16,sampleRate/64*18,sampleRate/64*20,sampleRate/64*22,sampleRate/64*24,sampleRate/64*26,sampleRate/64*28,sampleRate/64*30,sampleRate/64*32]}/>
    <CartesianGrid stroke="#ccc" />
    <Tooltip />
    <Legend/>
    <Line name="Modulated Carrier Spectrum/Widmo zmodyfikowanego sygnału nośnego" dot={false} type="monotone" dataKey="Amplitude" stroke="#ff0000" />
  </LineChart>

         <LineChart  width={width} height={height} data={NoiseDisplay}>
        <YAxis dataKey="Amplitude" />
    <CartesianGrid stroke="#ccc" />
    <Tooltip />
    <Legend/>
    <Line name="Signal after adding noise / Sygnał po dodaniu szumu" dot={false} type="monotone" dataKey="Amplitude" stroke="#8884d8" />
  </LineChart>

         <LineChart  width={width} height={height} data={demodulatedDisplay}>
        <YAxis dataKey="Amplitude" />
    <CartesianGrid stroke="#ccc" />
    <Tooltip />
    <Legend/>
    <Line name="Demodulated signal/Zdemodulowany sygnał" dot={false} type="monotone" dataKey="Amplitude" stroke="#228B22" />
  </LineChart>

      <LineChart  width={width} height={height} data={spectrumDisplay3}>
      <YAxis dataKey="Amplitude" />
                <XAxis dataKey="x" 
          domain={[0, sampleRate/2]}
          tickCount={7}
          type="number" ticks={[sampleRate/64*2,sampleRate/64*4,sampleRate/64*6,sampleRate/64*8,sampleRate/64*10,sampleRate/64*12,sampleRate/64*14,
          sampleRate/64*16,sampleRate/64*18,sampleRate/64*20,sampleRate/64*22,sampleRate/64*24,sampleRate/64*26,sampleRate/64*28,sampleRate/64*30,sampleRate/64*32]}/>
    <CartesianGrid stroke="#ccc" />
    <Tooltip />
    <Legend/>
    <Line name="Demodulated signal Spectrum/Widmo Zdemodulowanego sygnału" dot={false} type="monotone" dataKey="Amplitude" stroke="#ff0000"/>
  </LineChart>
    </div>
</>

  )

}
export default PM;



