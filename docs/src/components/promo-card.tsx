"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowUpRight, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

export function PromoCard() {
	const [isHovered, setIsHovered] = useState(false);
	const [isExpanded, setIsExpanded] = useState(true);

	useEffect(() => {
		const collapsed = localStorage.getItem("promoCollapsed");
		if (collapsed) setIsExpanded(false);
	}, []);

	const toggleExpanded = (e: React.MouseEvent) => {
		e.preventDefault();
		const newState = !isExpanded;
		setIsExpanded(newState);
		localStorage.setItem("promoCollapsed", newState ? "" : "true");
	};

	return (
		<div className={`w-full transition-opacity ${isExpanded ? 'opacity-60 dark:opacity-80' : 'opacity-40 dark:opacity-50'} hover:opacity-100`}>
			<div className="border border-zinc-200 dark:border-zinc-800 p-2 rounded-lg w-full my-2 bg-white dark:bg-zinc-900 flex flex-col gap-1 relative">
				<button
					onClick={toggleExpanded}
					className="absolute -right-2 -top-2 text-xs px-1 py-1 rounded-full bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors border border-zinc-200 dark:border-zinc-800"
				>
					{isExpanded ? (
						<ChevronUp className="w-3 h-3" />
					) : (
						<ChevronDown className="w-3 h-3" />
					)}
				</button>

				<Link
					href="https://www.gptplus.ca"
					className="flex flex-col gap-1 cursor-pointer"
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
				>
					{isExpanded && (
						<Image
							src="https://assets.ohevan.com/img/73e2fb96efbbfaf1a69bd2a54495ea99.jpg"
							alt="GPT Plus 共享"
							className="rounded-sm dark:brightness-75"
							width={1455}
							height={764}
						/>
					)}

					<h3 className="font-bold dark:text-white flex flex-row justify-between items-center">
						<span className="text-sm flex flex-row items-center gap-1">
							ChatGPT Plus 共享 <ArrowUpRight className="w-4 h-4" />
						</span>
						<span className="text-[0.5rem] dark:bg-zinc-800 dark:text-zinc-300 px-1.5 py-0.5 rounded-full bg-zinc-100 text-zinc-800">
							推广
						</span>
					</h3>

					<div className="text-xs dark:text-gray-300">
						{isHovered ? (
							<>
								<p>
									国内镜像直连，官方一致，支持 GPT-5 以及 Sora 等最新模型，由
									Evan 本人搭建，目前已稳定运行三年+
								</p>
								<p>
									优惠码 <code>REDEFINE24</code> 立减 3 元，折后仅需 24.99
									元/月起。
								</p>
							</>
						) : (
							<p>国内镜像直连，官方一致，支持 GPT-5 以及 Sora 等最新模型</p>
						)}
					</div>
				</Link>
			</div>
		</div>
	);
}