import FeaturedProducts from "@/components/featured-products"
import CallToAction from "@/components/call-to-action"
import HomeProducts from "@/components/home-products"
import { Button } from "@/components/ui/button"
import { ArrowRight} from "lucide-react"
import Link from "next/link"
// import { ShoppingCart, TicketPercent, ShoppingBasket, ShoppingBag, CreditCard, FlaskConical, Beaker, TestTubeDiagonal } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative flex max-w-7xl pt-12 mb-12 mx-auto shadow-lg overflow-hidden shadow-gray/50 border rounded-lg flex-col gap-5 w-full bg-primary p-2 py-6 justify-center items-center">
          <p className="text-center z-20 md:text-4xl font-bold text-xl">
            Buy and Sell your 
            <span style={{fontFamily: "objective-bold"}}> chemical stock </span>
            on our platform.
          </p>
          <p className="text-center z-20 md:text-base text-sm">
          If you didn&apos;t find the stock you were looking for in our listed items, feel free to request the product!
          </p>
          <p className="text-center z-20 md:text-lg text-xl">
            <Button asChild size="lg" variant="secondary">
              <Link href="/request">
                Request a Product <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </p>
          
          {/* <Button type="submit" style={{fontFamily: "objective-bold"}} className="bg-black text-white  shadow-lg shadow-gray/50 z-20 md:px-12 md:h-12 h-10 px-6 hover:bg-[#d0d0d0] hover:shadow-gray/70">
            Request Product
          </Button> */}
        </div>
      <FeaturedProducts />
      <HomeProducts />
      <CallToAction />
    </div>
  )
}
