import Hero from './Hero'
import {bgCategory1, bgCategory2} from '../../Utility/ImagesPlace';
import Quote from './Quote';
import RecommendedItems from './RecommendedItems';
import Services from './Services';
import Suppliers from './Suppliers';
import ProductSection from '../../Store/ProductSection';

const HomePage = () => {
    
    return (
        <>
            <Hero />
            <ProductSection 
                title="Deals and offers" 
                limit={5} 
                hasTimer={true} 
                selectView= 'deal'
                page={3}/>
            <ProductSection 
                title="Electronics and devices" 
                limit={10} 
                hasTimer={false}
                bannerImg={bgCategory1}
                selectView= 'horizontal'
                page= {1}/>
            <ProductSection 
                title="Consumer electronics and gadgets" 
                limit={10} 
                hasTimer={false}
                bannerImg={bgCategory2}
                selectView= 'horizontal'
                page= {2}/>
            <Quote />
            <RecommendedItems page={2}/>
            <Services />
            <Suppliers />
        </>
    )
}

export default HomePage