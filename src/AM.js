import { hilbertTransform } from 'hilbert_transform';
import React, { useState} from 'react';
import {LineChart, Line, CartesianGrid, YAxis,XAxis, Tooltip, Legend,}  from 'recharts';
import jstat from 'jstat';
import { directConvolution,} from 'ml-convolution';


const AM = () => {


    const lowPassFilter = require('low-pass-filter').lowPassFilter;
    var ft = require('fourier-transform');
    const [frequency, setfrequency] = useState(1024);
    const [Amplitude, setAmplitude] = useState(1);
    const [frequencyMod, setfrequencyMod] = useState(64);
    const [AmplitudeMod, setAmplitudeMod] = useState(1);
    const [CutOff, setCutOff] = useState(64);
    const [size, setsize] = useState(1024);
    const [ModulationIndex, setModulationIndex] = useState(1);
    const [kernelsize, setkernelsize] = useState(1023);
    const [Maxn, setMaxn] = useState(0);
    const [Minn, setMinn] = useState(0);

    const [style, setStyle] = useState("false");
    const changeStyle = () => {
    setStyle(current=>!current);
  };

      const [style2, setStyle2] = useState("false");
    const changeStyle2 = () => {
    setStyle2(current=>!current);
  };

  var sampleRate;
    if(frequency<=1024)
      sampleRate=4096;
    else
      sampleRate=8192;
    var x=new Array(size);
    var xdd=new Array(size);
    var waveform=new Array(size);
    var waveform2=new Array(size);
    var waveform3=new Array(size);
    var demodulated=new Array(size);
    var demodulatedlpf=new Array(size);
    var xd=new Array(size/2);
    var noise=new Array(size);
    var delta=new Array(size);
    var width=1200;
    var height=150;
    var sinc=new Array(parseInt(kernelsize, 10));
    var sinc3=new Array(parseInt(kernelsize, 10));
    var sinc5=new Array(parseInt(kernelsize, 10)+1);
    var kernel=new Array(parseInt(kernelsize, 10));
    var kernelspectrum=new Array((parseInt(kernelsize, 10)+1)/2);






 for (let i = 0; i<size; i++) 
  {
   waveform[i] = Amplitude*Math.sin(frequency * Math.PI * 2 * (i / sampleRate));
  x[i]=i;
  }

  var cutoffsinc=1*(CutOff/sampleRate)

   for (let i = 0; i<parseInt(kernelsize, 10); i++) 
  {
   sinc[i] = Math.sin(Math.PI*2*cutoffsinc*(i-(kernelsize/2)))/(Math.PI*2*cutoffsinc*(i-(kernelsize/2)));
   sinc3[i] = Math.sin(Math.PI*2*cutoffsinc*(i-(kernelsize/2)))/(Math.PI*2*cutoffsinc*(i-(kernelsize/2))) *(0.42-0.5*Math.cos(2*Math.PI*i/kernelsize)+0.08*Math.cos(4*Math.PI*i/kernelsize));
  kernel[i]=i;
  }

  var sum=0;
  var sum3=0;
  for(let i=0;i<parseInt(kernelsize, 10);i++)
  {
    sum=sum+sinc[i];
    sum3=sum3+sinc3[i];
  }

  for(let i=0;i<parseInt(kernelsize, 10);i++)
  {
    sinc[i]=sinc[i]/sum;
     sinc3[i]=sinc3[i]/sum3;
  }


  for (let i = 0; i<size; i++) 
  {
   waveform2[i] = AmplitudeMod*Math.sin(frequencyMod * Math.PI * 2 * (i / sampleRate));
   if(i===0)
    delta[i] = 1;
    else
    delta[i]=0;
  }
    
    var data=x.map((x,index)=>{
      let xObject ={};
      xObject.x=x;
      xObject.Amplitude=waveform[index];
      xObject.Amplitude2=waveform2[index];
      return xObject;
    })

     var sincdisplay=kernel.map((kernel,index)=>{
      let xObject ={};
      xObject.x=kernel;
      xObject.Amplitude=sinc[index];
      return xObject;
    })

         var sincdisplay3=kernel.map((kernel,index)=>{
      let xObject ={};
      xObject.x=kernel;
      xObject.Amplitude=sinc3[index];
      return xObject;
    })


  for (let i = 0; i<size; i++) 
  {
   waveform3[i] = Amplitude*(1+ModulationIndex*Math.sin(frequencyMod * Math.PI * 2 * (i / sampleRate)))*Math.sin(frequency * Math.PI * 2 * (i / sampleRate))
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


  for (let i = 0; i<size/2; i++) 
  {
  xd[i]=(i+1)*sampleRate/size;
  }

    for (let i = 0; i<((parseInt(kernelsize, 10)+1)/2); i++) 
  {
  kernelspectrum[i]=(i+1)*sampleRate/(parseInt(kernelsize, 10)+1);
  }
  
  

  for (let i = 0; i<size; i++) 
  {
  demodulated[i]=(noise[i]*waveform[i]);
  }

  var z=hilbertTransform(noise);
  var envelope=jstat.abs(z);

  var spectrum3 = ft(demodulated);
    spectrum3[0]=0;
      var spectrumDisplay3=xd.map((xd,index)=>{
      let xObject ={};
      xObject.x=xd;
      xObject.Amplitude=spectrum3[index];
      return xObject;
    })

   var spectrum5 = ft(envelope);
        spectrum5[0]=0;
      var spectrumDisplay5=xd.map((xd,index)=>{
      let xObject ={};
      xObject.x=xd;
      xObject.Amplitude=spectrum5[index];
      return xObject;
    })

  var demodulatedBeforelpf=x.map((x,index)=>{
      let xObject ={};
      xObject.x=x;
      xObject.Amplitude=demodulated[index];
      return xObject;
    })

       var EnvelopeDisplay=x.map((x,index)=>{
      let xObject ={};
      xObject.x=x;
      xObject.Amplitude=envelope[index];
      return xObject;
    })


    demodulatedlpf = demodulated;
    lowPassFilter(demodulatedlpf,CutOff,sampleRate,1)

    lowPassFilter(delta,CutOff,sampleRate,1)

    var envelopelpf = envelope;
    lowPassFilter(envelopelpf,CutOff,sampleRate,1)


const aftersplot = directConvolution(demodulated, sinc);

const aftersplot2 = directConvolution(demodulated, sinc3);



const envelopesplot = directConvolution(envelope, sinc);

const envelopesplot2 = directConvolution(envelope, sinc3);


  for (let i = 0; i<aftersplot.length; i++) 
  {
  xdd[i]=i;
  }

    var demodulatedDisplay=x.map((x,index)=>{
      let xObject ={};
      xObject.x=x;
      xObject.Amplitude=demodulatedlpf[index];
      return xObject;
    })

       var aftersplotDisplay=x.map((x,index)=>{
      let xObject ={};
      xObject.x=x;
      xObject.Amplitude=aftersplot[index];
      return xObject;
    })

           var envelopesplotDisplay=x.map((x,index)=>{
      let xObject ={};
      xObject.x=x;
      xObject.Amplitude=envelopesplot[index];
      return xObject;
    })

           var aftersplotDisplay2=x.map((x,index)=>{
      let xObject ={};
      xObject.x=x;
      xObject.Amplitude=aftersplot2[index];
      return xObject;
    })

           var envelopesplotDisplay2=x.map((x,index)=>{
      let xObject ={};
      xObject.x=x;
      xObject.Amplitude=envelopesplot2[index];
      return xObject;
    })


         var EnvelopelpfDisplay=x.map((x,index)=>{
      let xObject ={};
      xObject.x=x;
      xObject.Amplitude=envelopelpf[index];
      return xObject;
    })


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

        var spectrum4 = ft(demodulated);
        spectrum4[0]=0;
      var spectrumDisplay4=xd.map((xd,index)=>{
      let xObject ={};
      xObject.x=xd;
      xObject.Amplitude=spectrum4[index];
      return xObject;
    })

            var spectrum6 = ft(envelopelpf);
        spectrum6[0]=0;
      var spectrumDisplay6=xd.map((xd,index)=>{
      let xObject ={};
      xObject.x=xd;
      xObject.Amplitude=spectrum6[index];
      return xObject;
    })

                var spectrum7 = ft(delta);
        // spectrum7[0]=0;
      var spectrumDisplay7=xd.map((xd,index)=>{
      let xObject ={};
      xObject.x=xd;
      xObject.Amplitude=spectrum7[index];
      return xObject;
    })

      var spectrum8 = ft(aftersplot);
        spectrum8[0]=0;
      var spectrumDisplay8=xd.map((xd,index)=>{
      let xObject ={};
      xObject.x=xd;
      xObject.Amplitude=spectrum8[index];
      return xObject;
    })

          var spectrum9 = ft(aftersplot2);
        spectrum9[0]=0;
      var spectrumDisplay9=xd.map((xd,index)=>{
      let xObject ={};
      xObject.x=xd;
      xObject.Amplitude=spectrum9[index];
      return xObject;
    })


    sinc5=sinc;
    sinc5[kernelsize]=0;
                  var spectrum12 = ft(sinc5);
        // spectrum11[0]=0;
      var spectrumDisplay12=kernelspectrum.map((kernelspectrum,index)=>{
      let xObject ={};
      xObject.x=kernelspectrum;
      xObject.Amplitude=spectrum12[index];
      return xObject;
    })

     sinc5=sinc3;
    sinc5[kernelsize]=0;

                      var spectrum13 = ft(sinc5);
        // spectrum11[0]=0;
      var spectrumDisplay13=kernelspectrum.map((kernelspectrum,index)=>{
      let xObject ={};
      xObject.x=kernelspectrum;
      xObject.Amplitude=spectrum13[index];
      return xObject;
    })

          var spectrum10 = ft(envelopesplot);
        spectrum10[0]=0;
      var spectrumDisplay10=xd.map((xd,index)=>{
      let xObject ={};
      xObject.x=xd;
      xObject.Amplitude=spectrum10[index];
      return xObject;
    })

              var spectrum11 = ft(envelopesplot2);
        spectrum11[0]=0;
      var spectrumDisplay11=xd.map((xd,index)=>{
      let xObject ={};
      xObject.x=xd;
      xObject.Amplitude=spectrum11[index];
      return xObject;
    })

  return(
    
<>
<div className="titlePage"><h2>Amplitude Modulation / Modulacja Amplitudy</h2></div>
<div className="sliders" >
  <form>
    <h2>Carrier signal / Sygnał Nośny</h2>
      <input type="range" id="frequency" name="frequency" value={frequency}
         min="512" max="1920" step="128" onChange={e=>(setfrequency)(e.target.value)}/>
          <label htmlFor="frequency">Frequency / Częstotliwość: {frequency} </label>
        <p></p>
      <input type="range" id="Amplitude" name="Amplitude" value={Amplitude}
         min="1" max="10" step="1" onChange={e=>(setAmplitude)(e.target.value)}/>
          <label htmlFor="Amplitude">Amplitude / Amplituda: {Amplitude}</label>
    <p></p>
   <h2>Modulating signal / Sygnał Modulujący</h2>
      <input type="range" id="frequency" name="frequency" value={frequencyMod}
         min="16" max="256" step="16" onChange={e=>(setfrequencyMod)(e.target.value)}/>
          <label htmlFor="frequency">Frequency / Częstotliwość: {frequencyMod}</label>
      {/* <p></p>
      <input type="range" id="Amplitude" name="Amplitude" value={AmplitudeMod}
         min="1" max="10" step="1" onChange={e=>(setAmplitudeMod)(e.target.value)}/>
          <label htmlFor="Amplitude">Amplitude/Amplituda: {AmplitudeMod}</label> */}
<p></p>
    <input type="range" id="ModulationIndex" name="ModulationIndex" value={ModulationIndex}
         min="0.5" max="2" step="0.1" onChange={e=>(setModulationIndex)(e.target.value)}/>
          <label htmlFor="ModulationIndex">Modulation index / Indeks modulacji: {ModulationIndex}</label>
      {/* <input type="range" id="size" name="Czestotliwosc2" value={size}
         min="1024" max="1024" onChange={e=>(setsize)(e.target.value)}/>
          <label for="size">size</label>
                    <h3>{size}</h3> */}
      {/* <input type="range" id="sampleRate" name="Czestotliwosc3" value={sampleRate}
         min="44100" max="44100" onChange={e=>(setsampleRate)(e.target.value)}/>
          <label for="SampleRate">SampleRate</label>
                    <h3>{sampleRate}</h3> */}
                    <p></p>
    <h2>Low-pass filter / Filtr dolnoprzepustowy</h2>
      <input type="range" id="Cut-off" name="Cut-off" value={CutOff}
         min="32" max="2048" step="32" onChange={e=>(setCutOff)(e.target.value)}/>
          <label htmlFor="Cut-off">Cutoff frequency / Częstotliwość odcięcia: {CutOff}</label>
<p></p>
                 <h2>Noise / Szum</h2>
      {/* <input type="range" id="Minn" name="Minn" value={Minn}
         min="0" max="1" step="0.1" onChange={e=>(setMinn)(e.target.value)} />
          <label htmlFor="Minn">Min noise/Min szum: {Minn}</label>
          <p></p> */}
      <input type="range" id="Minn" name="Minn" value={Maxn}
         min="0" max="0.1" step="0.01" onChange={e=>(setMaxn)(e.target.value)} />
          <label htmlFor="Maxn">value / wartość: {Maxn}</label>
<p></p>
    <select onChange={e=>(setkernelsize)(e.target.value)}>
      <option value='127' >127</option>
    <option value='255' >255</option>
   <option value='511' >511</option>
  <option selected value='1023'>1023</option>
  </select>
          <label htmlFor="ModulationIndex">Kernel size / Rozmiar jądra: {kernelsize}</label>
          <p></p>

        <button className="button" type="button" onClick={changeStyle}>
          Synchronous demodulation / Demodulacja synchroniczna
          <p>
          </p>
          Envelope detection / Detekcja obwiedni
        </button>
<p></p>
        <button className="button" type="button" onClick={changeStyle2}>
          A first-order filter / Filtr pierwszego rzędu
          <p>
          </p>
          Windowed-Sinc filter
        </button>
      
  </form>
</div>
<div className="charts">




    <LineChart  width={width} height={height} data={data}>
      <CartesianGrid stroke="#ccc" />
      <YAxis dataKey="Amplitude"/>
      <Tooltip />
      <Legend/>
      <Line name="Carrier signal/Sygnał nośny" dot={false} type="monotone" dataKey="Amplitude" stroke="#8884d8" />
      <Line name="Modulating signal/Sygnał Modulujący" dot={false} type="monotone" dataKey="Amplitude2" stroke="	#228B22" />
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
    <Line name="Modulated Carrier/Zmodulowany sygnał nośny" dot={false} type="monotone" dataKey="Amplitude" stroke="#8884d8" />
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
    <Line name="Modulated Carrier Spectrum/Widmo zmodulowanego sygnału nośnego" dot={false} type="monotone" dataKey="Amplitude" stroke="#ff0000" />
  </LineChart>

           <LineChart  width={width} height={height} data={NoiseDisplay}>
        <YAxis dataKey="Amplitude" />
    <CartesianGrid stroke="#ccc" />
    <Tooltip />
    <Legend/>
    <Line name="Signal after adding noise / Sygnał po dodaniu szumu" dot={false} type="monotone" dataKey="Amplitude" stroke="#8884d8" />
  </LineChart>


<div style={{display: style ? 'block' : 'none'}}>
 <h3>Synchronous demodulation / Demodulacja synchroniczna</h3>
          <LineChart  width={width} height={height} data={demodulatedBeforelpf}>
        <YAxis dataKey="Amplitude" />
    <CartesianGrid stroke="#ccc" />
    <Tooltip />
    <Legend/>
    <Line name="Demodulated signal before filtering/Zdemodulowany sygnał przed filtrowaniem" dot={false} type="monotone" dataKey="Amplitude" stroke="#8884d8" />
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
    <Line name="Spectrum of demodulated signal before filtering/Widmo zdemodulowanego sygnału przed filtrowaniem" dot={false} type="monotone" dataKey="Amplitude" stroke="#ff0000" />
  </LineChart>

    <div style={{display: style2 ? 'block' : 'none'}}>
  <h3>A first-order filter / Filtr pierwszego rzędu</h3>

         <LineChart  width={width} height={height} data={demodulatedDisplay}>
        <YAxis dataKey="Amplitude" />
    <CartesianGrid stroke="#ccc" />
    <Tooltip />
    <Legend/>
    <Line name="Demodulated signal/Zdemodulowany sygnał" dot={false} type="monotone" dataKey="Amplitude" stroke="#228B22" />
  </LineChart>

                 <LineChart  width={width} height={height} data={spectrumDisplay7}>
        <YAxis dataKey="Amplitude" />
                  <XAxis dataKey="x" 
          domain={[0, sampleRate/2]}
          tickCount={7}
          type="number" ticks={[sampleRate/64*2,sampleRate/64*4,sampleRate/64*6,sampleRate/64*8,sampleRate/64*10,sampleRate/64*12,sampleRate/64*14,
          sampleRate/64*16,sampleRate/64*18,sampleRate/64*20,sampleRate/64*22,sampleRate/64*24,sampleRate/64*26,sampleRate/64*28,sampleRate/64*30,sampleRate/64*32]}/>
    <CartesianGrid stroke="#ccc" />
    <Tooltip />
    <Legend/>
    <Line name="Low-pass filter / Filtr dolnoprzepustowy" dot={false} type="monotone" dataKey="Amplitude" stroke="blue" />
  </LineChart>

         <LineChart  width={width} height={height} data={spectrumDisplay4}>
        <YAxis dataKey="Amplitude" />
                   <XAxis dataKey="x" 
          domain={[0, sampleRate/2]}
          tickCount={7}
          type="number" ticks={[sampleRate/64*2,sampleRate/64*4,sampleRate/64*6,sampleRate/64*8,sampleRate/64*10,sampleRate/64*12,sampleRate/64*14,
          sampleRate/64*16,sampleRate/64*18,sampleRate/64*20,sampleRate/64*22,sampleRate/64*24,sampleRate/64*26,sampleRate/64*28,sampleRate/64*30,sampleRate/64*32]}/>
    <CartesianGrid stroke="#ccc" />
    <Tooltip />
    <Legend/>
    <Line name="Demodulated signal Spectrum/Widmo zdemodulowanego sygnału" dot={false} type="monotone" dataKey="Amplitude" stroke="#ff0000" />
  </LineChart>
  </div>

   <div style={{display: style2 ? 'none' : 'block'}}>
  <h3>Sinc filter</h3>


     <div>
     <h4>Non-windowed</h4>

            <LineChart  width={width} height={height} data={aftersplotDisplay}>
        <YAxis dataKey="Amplitude" />
    <CartesianGrid stroke="#ccc" />
    <Tooltip />
    <Legend/>
    <Line name="Demodulated Carrier/Zdemodulowany sygnał nośny" dot={false} type="monotone" dataKey="Amplitude" stroke="#228B22" />
  </LineChart>  

            <LineChart  width={width} height={height} data={sincdisplay}>
        <YAxis dataKey="Amplitude" />
    <CartesianGrid stroke="#ccc" />
    <Tooltip />
    <Legend/>
    <Line name=" Filter kernel / Jądro filtra" dot={false} type="monotone" dataKey="Amplitude" stroke="blue" />
  </LineChart>  



              <LineChart  width={width} height={height} data={spectrumDisplay12}>
        <YAxis dataKey="Amplitude" />
              <XAxis dataKey="x" 
          domain={[0, sampleRate/2]}
          tickCount={7}
          type="number" ticks={[sampleRate/64*2,sampleRate/64*4,sampleRate/64*6,sampleRate/64*8,sampleRate/64*10,sampleRate/64*12,sampleRate/64*14,
          sampleRate/64*16,sampleRate/64*18,sampleRate/64*20,sampleRate/64*22,sampleRate/64*24,sampleRate/64*26,sampleRate/64*28,sampleRate/64*30,sampleRate/64*32]}/>
    <CartesianGrid stroke="#ccc" />
    <Tooltip />
    <Legend/>
    <Line name="Sinc filter" dot={false} type="monotone" dataKey="Amplitude" stroke="blue" />
  </LineChart>   

              <LineChart  width={width} height={height} data={spectrumDisplay8}>
        <YAxis dataKey="Amplitude" />
                 <XAxis dataKey="x" 
          domain={[0, sampleRate/2]}
          tickCount={7}
          type="number" ticks={[sampleRate/64*2,sampleRate/64*4,sampleRate/64*6,sampleRate/64*8,sampleRate/64*10,sampleRate/64*12,sampleRate/64*14,
          sampleRate/64*16,sampleRate/64*18,sampleRate/64*20,sampleRate/64*22,sampleRate/64*24,sampleRate/64*26,sampleRate/64*28,sampleRate/64*30,sampleRate/64*32]}/>
    <CartesianGrid stroke="#ccc" />
    <Tooltip />
    <Legend/>
    <Line name="Demodulated signal Spectrum/Widmo zdemodulowanego sygnału" dot={false} type="monotone" dataKey="Amplitude" stroke="#ff0000" />
  </LineChart>  
          </div>

     <div>
     <h4>Windowed</h4>

            <LineChart  width={width} height={height} data={aftersplotDisplay2}>
        <YAxis dataKey="Amplitude" />
    <CartesianGrid stroke="#ccc" />
    <Tooltip />
    <Legend/>
    <Line name="Demodulated Carrier/Zdemodulowany sygnał nośny" dot={false} type="monotone" dataKey="Amplitude" stroke="#228B22" />
  </LineChart>  

            <LineChart  width={width} height={height} data={sincdisplay3}>
        <YAxis dataKey="Amplitude" />
    <CartesianGrid stroke="#ccc" />
    <Tooltip />
    <Legend/>
    <Line name=" Filter kernel / Jądro filtra" dot={false} type="monotone" dataKey="Amplitude" stroke="blue" />
  </LineChart>  



              <LineChart  width={width} height={height} data={spectrumDisplay13}>
        <YAxis dataKey="Amplitude" />
              <XAxis dataKey="x" 
          domain={[0, sampleRate/2]}
          tickCount={7}
          type="number" ticks={[sampleRate/64*2,sampleRate/64*4,sampleRate/64*6,sampleRate/64*8,sampleRate/64*10,sampleRate/64*12,sampleRate/64*14,
          sampleRate/64*16,sampleRate/64*18,sampleRate/64*20,sampleRate/64*22,sampleRate/64*24,sampleRate/64*26,sampleRate/64*28,sampleRate/64*30,sampleRate/64*32]}/>
    <CartesianGrid stroke="#ccc" />
    <Tooltip />
    <Legend/>
    <Line name="Windowed-Sinc filter" dot={false} type="monotone" dataKey="Amplitude" stroke="blue" />
  </LineChart>   

              <LineChart  width={width} height={height} data={spectrumDisplay9}>
        <YAxis dataKey="Amplitude" />
                 <XAxis dataKey="x" 
          domain={[0, sampleRate/2]}
          tickCount={7}
          type="number" ticks={[sampleRate/64*2,sampleRate/64*4,sampleRate/64*6,sampleRate/64*8,sampleRate/64*10,sampleRate/64*12,sampleRate/64*14,
          sampleRate/64*16,sampleRate/64*18,sampleRate/64*20,sampleRate/64*22,sampleRate/64*24,sampleRate/64*26,sampleRate/64*28,sampleRate/64*30,sampleRate/64*32]}/>
    <CartesianGrid stroke="#ccc" />
    <Tooltip />
    <Legend/>
    <Line name="Demodulated signal Spectrum/Widmo zdemodulowanego sygnału" dot={false} type="monotone" dataKey="Amplitude" stroke="#ff0000" />
  </LineChart>  
          </div>

</div>

</div>

{/* detekcja obwiedni */}

<div style={{display: style ? 'none' : 'block'}}>
<h3>Envelope detection / Detekcja obwiedni</h3>

         <LineChart  width={width} height={height} data={EnvelopeDisplay}>
        <YAxis dataKey="Amplitude" />
    <CartesianGrid stroke="#ccc" />
    <Tooltip />
    <Legend/>
    <Line name="Demodulated Carrier Spectrum before filtering/Widmo zdemodulowanego sygnału nośnego przed filtrowaniem" dot={false} type="monotone" dataKey="Amplitude" stroke="#8884d8" />
  </LineChart>

           <LineChart  width={width} height={height} data={spectrumDisplay5}>
        <YAxis dataKey="Amplitude" />
                  <XAxis dataKey="x" 
          domain={[0, sampleRate/2]}
          tickCount={7}
          type="number" ticks={[sampleRate/64*2,sampleRate/64*4,sampleRate/64*6,sampleRate/64*8,sampleRate/64*10,sampleRate/64*12,sampleRate/64*14,
          sampleRate/64*16,sampleRate/64*18,sampleRate/64*20,sampleRate/64*22,sampleRate/64*24,sampleRate/64*26,sampleRate/64*28,sampleRate/64*30,sampleRate/64*32]}/>
    <CartesianGrid stroke="#ccc" />
    <Tooltip />
    <Legend/>
    <Line name="Spectrum of demodulated signal before filtering/Widmo zdemodulowanego sygnału przed filtrowaniem" dot={false} type="monotone" dataKey="Amplitude" stroke="#ff0000" />
  </LineChart>

    <div style={{display: style2 ? 'block' : 'none'}}>
  <h3>A first-order filter / Filtr pierwszego rzędu</h3>

           <LineChart  width={width} height={height} data={EnvelopelpfDisplay}>
        <YAxis dataKey="Amplitude" />
    <CartesianGrid stroke="#ccc" />
    <Tooltip />
    <Legend/>
    <Line name="Demodulated signal/Zdemodulowany sygnał" dot={false} type="monotone" dataKey="Amplitude" stroke="#228B22" />
  </LineChart>


                   <LineChart  width={width} height={height} data={spectrumDisplay7}>
        <YAxis dataKey="Amplitude" />
                 <XAxis dataKey="x" 
          domain={[0, sampleRate/2]}
          tickCount={7}
          type="number" ticks={[sampleRate/64*2,sampleRate/64*4,sampleRate/64*6,sampleRate/64*8,sampleRate/64*10,sampleRate/64*12,sampleRate/64*14,
          sampleRate/64*16,sampleRate/64*18,sampleRate/64*20,sampleRate/64*22,sampleRate/64*24,sampleRate/64*26,sampleRate/64*28,sampleRate/64*30,sampleRate/64*32]}/>
    <CartesianGrid stroke="#ccc" />
    <Tooltip />
    <Legend/>
    <Line name="Low-pass filter / Filtr dolnoprzepustowy" dot={false} type="monotone" dataKey="Amplitude" stroke="blue" />
  </LineChart>

           <LineChart  width={width} height={height} data={spectrumDisplay6}>
        <YAxis dataKey="Amplitude" />
                 <XAxis dataKey="x" 
          domain={[0, sampleRate/2]}
          tickCount={7}
          type="number" ticks={[sampleRate/64*2,sampleRate/64*4,sampleRate/64*6,sampleRate/64*8,sampleRate/64*10,sampleRate/64*12,sampleRate/64*14,
          sampleRate/64*16,sampleRate/64*18,sampleRate/64*20,sampleRate/64*22,sampleRate/64*24,sampleRate/64*26,sampleRate/64*28,sampleRate/64*30,sampleRate/64*32]}/>
    <CartesianGrid stroke="#ccc" />
    <Tooltip />
    <Legend/>
    <Line name="Demodulated signal Spectrum/Widmo zdemodulowanego sygnału" dot={false} type="monotone" dataKey="Amplitude" stroke="#ff0000" />
  </LineChart>
  </div>

  <div style={{display: style2 ? 'none' : 'block'}}>
  <h3>Windowed-Sinc filter</h3>

  <div>
  <h4>Non-windowed</h4>

              <LineChart  width={width} height={height} data={envelopesplotDisplay}>
        <YAxis dataKey="Amplitude" />
    <CartesianGrid stroke="#ccc" />
    <Tooltip />
    <Legend/>
    <Line name="Demodulated Carrier/Zdemodulowany sygnał nośny" dot={false} type="monotone" dataKey="Amplitude" stroke="#228B22" />
  </LineChart>  

          <LineChart  width={width} height={height} data={sincdisplay}>
        <YAxis dataKey="Amplitude" />
    <CartesianGrid stroke="#ccc" />
    <Tooltip />
    <Legend/>
    <Line name=" Filter kernel / Jądro filtra" dot={false} type="monotone" dataKey="Amplitude" stroke="blue" />
  </LineChart>  


            <LineChart  width={width} height={height} data={spectrumDisplay12}>
        <YAxis dataKey="Amplitude" />
          <XAxis dataKey="x" 
          domain={[0, sampleRate/2]}
          tickCount={7}
          type="number" ticks={[sampleRate/64*2,sampleRate/64*4,sampleRate/64*6,sampleRate/64*8,sampleRate/64*10,sampleRate/64*12,sampleRate/64*14,
          sampleRate/64*16,sampleRate/64*18,sampleRate/64*20,sampleRate/64*22,sampleRate/64*24,sampleRate/64*26,sampleRate/64*28,sampleRate/64*30,sampleRate/64*32]}/>
    <CartesianGrid stroke="#ccc" />
    <Tooltip />
    <Legend/>
    <Line name="Windowed-Sinc filter" dot={false} type="monotone" dataKey="Amplitude" stroke="blue" />
  </LineChart>  


              <LineChart  width={width} height={height} data={spectrumDisplay10}>
        <YAxis dataKey="Amplitude" />
                  <XAxis dataKey="x" 
          domain={[0, sampleRate/2]}
          tickCount={7}
          type="number" ticks={[sampleRate/64*2,sampleRate/64*4,sampleRate/64*6,sampleRate/64*8,sampleRate/64*10,sampleRate/64*12,sampleRate/64*14,
          sampleRate/64*16,sampleRate/64*18,sampleRate/64*20,sampleRate/64*22,sampleRate/64*24,sampleRate/64*26,sampleRate/64*28,sampleRate/64*30,sampleRate/64*32]}/>
    <CartesianGrid stroke="#ccc" />
    <Tooltip />
    <Legend/>
    <Line name="Demodulated signal Spectrum/Widmo zdemodulowanego sygnału" dot={false} type="monotone" dataKey="Amplitude" stroke="#ff0000" />
  </LineChart>  
  </div>

  <div>
  <h4>Windowed</h4>

              <LineChart  width={width} height={height} data={envelopesplotDisplay2}>
        <YAxis dataKey="Amplitude" />
    <CartesianGrid stroke="#ccc" />
    <Tooltip />
    <Legend/>
    <Line name="Demodulated Carrier/Zdemodulowany sygnał nośny" dot={false} type="monotone" dataKey="Amplitude" stroke="#228B22" />
  </LineChart>  

          <LineChart  width={width} height={height} data={sincdisplay3}>
        <YAxis dataKey="Amplitude" />
    <CartesianGrid stroke="#ccc" />
    <Tooltip />
    <Legend/>
    <Line name=" Filter kernel / Jądro filtra" dot={false} type="monotone" dataKey="Amplitude" stroke="blue" />
  </LineChart>  


            <LineChart  width={width} height={height} data={spectrumDisplay13}>
        <YAxis dataKey="Amplitude" />
          <XAxis dataKey="x" 
          domain={[0, sampleRate/2]}
          tickCount={7}
          type="number" ticks={[sampleRate/64*2,sampleRate/64*4,sampleRate/64*6,sampleRate/64*8,sampleRate/64*10,sampleRate/64*12,sampleRate/64*14,
          sampleRate/64*16,sampleRate/64*18,sampleRate/64*20,sampleRate/64*22,sampleRate/64*24,sampleRate/64*26,sampleRate/64*28,sampleRate/64*30,sampleRate/64*32]}/>
    <CartesianGrid stroke="#ccc" />
    <Tooltip />
    <Legend/>
    <Line name="Windowed-Sinc filter" dot={false} type="monotone" dataKey="Amplitude" stroke="blue" />
  </LineChart>  


              <LineChart  width={width} height={height} data={spectrumDisplay11}>
        <YAxis dataKey="Amplitude" />
                  <XAxis dataKey="x" 
          domain={[0, sampleRate/2]}
          tickCount={7}
          type="number" ticks={[sampleRate/64*2,sampleRate/64*4,sampleRate/64*6,sampleRate/64*8,sampleRate/64*10,sampleRate/64*12,sampleRate/64*14,
          sampleRate/64*16,sampleRate/64*18,sampleRate/64*20,sampleRate/64*22,sampleRate/64*24,sampleRate/64*26,sampleRate/64*28,sampleRate/64*30,sampleRate/64*32]}/>
    <CartesianGrid stroke="#ccc" />
    <Tooltip />
    <Legend/>
    <Line name="Demodulated signal Spectrum/Widmo zdemodulowanego sygnału" dot={false} type="monotone" dataKey="Amplitude" stroke="#ff0000" />
  </LineChart>  
  </div>


       </div>   
  </div>

    </div>
</>

  )

}
export default AM;
