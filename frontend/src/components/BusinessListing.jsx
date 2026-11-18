import React from 'react';
import { Star, Heart, ChevronRight, MapPin, Frown, PlusCircle, Loader2 } from 'lucide-react';

const BusinessListing = ({ 
  filteredShops, 
  visibleCount, 
  showFavorites, 
  setShowFavorites, 
  setSelectedShop, 
  toggleFavorite, 
  favorites, 
  isLoadingMore, 
  handleViewMore 
}) => {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 pb-20 text-left italic relative z-10">
      <div className="flex items-end justify-between mb-16 px-4">
        <div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase mb-4 text-white">
            {showFavorites ? "Saved" : "Featured"} <span className="text-purple-500">Places</span>
          </h2>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">
            {showFavorites ? `You have ${filteredShops.length} saved items` : "Handpicked businesses for you"}
          </p>
        </div>
      </div>
      
      {filteredShops.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredShops.slice(0, visibleCount).map((shop) => (
            <div key={shop.id} onClick={() => setSelectedShop(shop)} className="group relative cursor-pointer text-left h-full perspective-1000">
              <div className="group bg-[#1a102e]/60 border border-white/5 rounded-[40px] p-4 transition-all hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:-translate-y-2 block shadow-2xl backdrop-blur-md h-full flex flex-col">
                
                <div className="h-72 rounded-[32px] overflow-hidden relative mb-6">
                  <img
                    src={shop.image || "https://images.unsplash.com/photo-1528698827591-e19ccd7c8b04"}
                    alt={shop.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#05010d] via-transparent to-transparent opacity-80"></div>
                  
                  <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/10 shadow-lg font-bold text-white italic">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" /> {shop.rating}
                  </div>
                  <button 
                    onClick={(e) => toggleFavorite(e, shop.id)}
                    className={`absolute top-4 left-4 p-2.5 rounded-full backdrop-blur-md border border-white/10 transition-all ${favorites.includes(shop.id) ? 'bg-red-500 text-white shadow-red-500/50 shadow-lg scale-110' : 'bg-black/40 text-white hover:bg-white/20'}`}
                  >
                    <Heart size={16} className={favorites.includes(shop.id) ? "fill-white" : ""} />
                  </button>
                  
                  <div className="absolute bottom-4 left-4 bg-purple-600 px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg text-white border border-white/10">
                    {shop.category}
                  </div>
                </div>
                  
                <div className="px-2 text-left text-white flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight mb-2 group-hover:text-purple-400 transition uppercase leading-tight">{shop.name}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2 mb-4 font-sans not-italic font-medium">{shop.desc}</p>
                  </div>
                  <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase tracking-widest font-sans border-t border-white/5 pt-4">
                    <span className="flex items-center gap-2 font-sans group-hover:text-white transition-colors">
                      <MapPin size={14} className="text-purple-500" /> {shop.location}
                    </span>
                    <div className="bg-white/5 p-2 rounded-full group-hover:bg-purple-600 group-hover:text-white transition-all">
                      <ChevronRight size={14}/>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in">
          <div className="bg-white/5 p-8 rounded-full mb-6">
            <Frown size={48} className="text-gray-600" />
          </div>
          <h3 className="text-2xl font-black uppercase text-gray-500 mb-2">{showFavorites ? "Wishlist Empty" : "No Results Found"}</h3>
          <p className="text-gray-600 font-sans">{showFavorites ? "Go back and save some places you like!" : "Try searching for something else like 'Medical' or 'Gym'."}</p>
          {showFavorites && (
            <button onClick={() => setShowFavorites(false)} className="mt-6 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-widest transition-all">Browse Places</button>
          )}
        </div>
      )}
      
      {!showFavorites && filteredShops.length > visibleCount && (
        <div className="mt-20 flex justify-center w-full">
          <button
            type="button"
            onClick={handleViewMore}
            disabled={isLoadingMore}
            className="group bg-gradient-to-r from-purple-900 to-blue-900 border border-white/10 px-16 py-6 rounded-[32px] font-black uppercase text-xs tracking-widest hover:scale-105 transition-all flex items-center gap-3 text-white disabled:opacity-50 shadow-2xl hover:shadow-purple-500/20"
          >
            {isLoadingMore ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <PlusCircle size={18} className="group-hover:rotate-90 transition-transform" />
            )}
            <span>{isLoadingMore ? "Loading..." : "View More Listings"}</span>
          </button>
        </div>
      )}
    </section>
  );
};

export default BusinessListing;