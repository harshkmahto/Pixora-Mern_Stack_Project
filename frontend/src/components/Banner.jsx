import React from "react";
import { 
  FiArrowRight, 
  FiCheckCircle, 
  FiClock, 
  FiShield,
  FiImage,
  FiVideo,
  FiEdit,
  FiLayout,
  FiTrendingUp,
  FiCamera,
  FiStar
} from "react-icons/fi";

const Banner = () => {
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden">

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 lg:px-12 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full py-20">
          
          {/* Left Content */}
          <div className="text-white space-y-8">
            
            {/* Small Tagline with Rating */}
            <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
              <div className="flex text-yellow-400">
                <FiStar className="fill-current" />
                <FiStar className="fill-current" />
                <FiStar className="fill-current" />
                <FiStar className="fill-current" />
                <FiStar className="fill-current" />
              </div>
              <span className="text-sm font-medium">Trusted by 5000+ creators</span>
            </div>

            {/* Main Heading with Pixora Branding */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
                Pixora
              </span>
              <span className="block text-white text-4xl md:text-5xl mt-2">
                Premium Creative Services
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-200 leading-relaxed max-w-xl">
              Transform your content with professional thumbnail design, video editing, and creative services that make your brand stand out.
            </p>

           

            {/* Features List */}
            <div className="space-y-3 pt-2">
              {[
                { icon: FiCheckCircle, text: 'Professional thumbnail design in 24 hours' },
                { icon: FiClock, text: 'Unlimited revisions until you\'re satisfied' },
                { icon: FiShield, text: '100% copyright ownership & commercial use' },
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <feature.icon className="text-green-400 text-xl flex-shrink-0" />
                  <span className="text-gray-200">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-yellow-400 to-pink-400 text-white rounded-lg font-semibold 
                hover:from-yellow-500 hover:to-pink-500 transition-all duration-300 shadow-2xl hover:shadow-pink-500/25 
                flex items-center overflow-hidden">
                <span className="relative z-10 flex items-center">
                  Create Your Thumbnail
                  <FiArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>
              
              
            </div>

            
          </div>

         
      </div>
      </div>
      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
          <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

    </div>
  );
};

export default Banner;