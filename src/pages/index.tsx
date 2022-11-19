import React from "react";
import { type NextPage } from "next";
import Head from "next/head";
import {
  PencilIcon,
  CalendarDaysIcon,
  GiftIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { useChristmas } from "../lib/hooks/christmas";
import NavLayout from "../lib/layouts/NavLayout";
import { Footer } from "../lib/components/Footer";

const Index: NextPage = () => {
  return (
    <>
      <Head>
        <title>KrisKringle</title>
      </Head>
      <div className="flex w-full flex-col items-center bg-base-100">
        <NavLayout>
          <Hero />
          <Features />
          <Footer />
        </NavLayout>
      </div>
    </>
  );
};

export default Index;

const Hero = () => {
  const christmas = useChristmas();

  return (
    <div className="hero bg-base-100 pt-5 sm:py-12">
      <div className="hero-content sm:text-center">
        <div className="w-full max-w-md">
          <h1 className="text-5xl font-bold">
            Give a present
            <br />
            Get a present
          </h1>
          <p className="py-6">
            Start a Secret Santa group with your friends & family
          </p>
          <Timer christmas={christmas} />
          <h2 className="mt-5 text-2xl font-bold">
            Until {christmas.christmas}
          </h2>
        </div>
      </div>
    </div>
  );
};

const Timer: React.FC<{ christmas: ReturnType<typeof useChristmas> }> = ({
  christmas,
}) => {
  return (
    <div className="flex w-full justify-center space-x-5 text-center">
      <div className="rounded-box flex flex-col bg-neutral p-2 text-neutral-content">
        <span className="countdown font-mono text-5xl">
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore */}
          <span style={{ "--value": christmas.days }}></span>
        </span>
        days
      </div>
      <div className="rounded-box flex flex-col bg-neutral p-2 text-neutral-content">
        <span className="countdown font-mono text-5xl">
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore */}
          <span style={{ "--value": christmas.hours }}></span>
        </span>
        hours
      </div>
      <div className="rounded-box flex flex-col bg-neutral p-2 text-neutral-content">
        <span className="countdown font-mono text-5xl">
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore */}
          <span style={{ "--value": christmas.minutes }}></span>
        </span>
        min
      </div>
      <div className="rounded-box flex flex-col bg-neutral p-2 text-neutral-content">
        <span className="countdown font-mono text-5xl">
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore */}
          <span style={{ "--value": christmas.seconds }}></span>
        </span>
        sec
      </div>
    </div>
  );
};

const features = [
  {
    name: "Competitive exchange rates",
    description:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.",
    icon: GiftIcon,
  },
  {
    name: "No hidden fees",
    description:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.",
    icon: UsersIcon,
  },
  {
    name: "Transfers are instant",
    description:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.",
    icon: PencilIcon,
  },
  {
    name: "Mobile notifications",
    description:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.",
    icon: CalendarDaysIcon,
  },
];

function Features() {
  return (
    <div className="flex-none pb-12 sm:pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="sm:text-center">
          <h2 className="text-lg font-semibold leading-8 text-secondary-content">
            Transactions
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-neutral sm:text-4xl">
            A better way to send money
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            Lorem ipsum dolor sit amet consect adipisicing elit. Possimus magnam
            voluptatum cupiditate veritatis in accusamus quisquam.
          </p>
        </div>

        <div className="mt-20 max-w-lg sm:mx-auto md:max-w-none">
          <div className="grid grid-cols-1 gap-y-16 md:grid-cols-2 md:gap-x-12 md:gap-y-16">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="relative flex flex-col gap-6 sm:flex-row md:flex-col lg:flex-row"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white sm:shrink-0">
                  <feature.icon className="h-8 w-8" aria-hidden="true" />
                </div>
                <div className="sm:min-w-0 sm:flex-1">
                  <p className="text-lg font-semibold leading-8 text-gray-900">
                    {feature.name}
                  </p>
                  <p className="mt-2 text-base leading-7 text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
