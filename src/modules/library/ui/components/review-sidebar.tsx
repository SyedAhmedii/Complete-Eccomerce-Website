import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ReviewForm } from "./review-form";

interface Props {
          productId: string;
}

export const ReviewSidebar = ({ productId }: Props) =>{
          const trpc = useTRPC();

          // Every time using useSuspenseQuery you need to have matching prefetch
          const { data } = useSuspenseQuery(trpc.reviews.getOne.queryOptions({
                    productId,
          }));


          return (
                    <ReviewForm 
                    productId={productId}
                    initialData = {data}
                    />
          )
}