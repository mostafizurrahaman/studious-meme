import { contactChannels } from '@/lib/malamal-content';

export default function OurContactsPage() {
  return (
    <main className="flex-1 bg-[#f5f6f8] pb-16">
      <div className="mx-auto w-full max-w-350 px-4 py-6 lg:px-6">
        <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#f15a24]">
            Get in touch
          </p>
          <h1 className="mt-4 text-3xl font-black text-[#0e2f56] sm:text-4xl">
            Our Contacts
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-black/65 sm:text-base">
            Contact details, office information and support channels are laid out for the
            storefront.
          </p>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {contactChannels.map(channel => (
            <a key={channel.label} href={channel.href} className="rounded-3xl bg-white p-5 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#f15a24]">
                {channel.label}
              </div>
              <div className="mt-3 text-lg font-black text-[#0e2f56]">{channel.value}</div>
            </a>
          ))}
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl bg-[#0e2f56] p-6 text-white shadow-sm">
              <h2 className="text-2xl font-black">Office</h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-white/78">
                Level 11 & 12, Medona Tower, 28, Mohakhali C/A, Dhaka-1212.
              </p>
              <div className="mt-6 rounded-2xl bg-white/10 p-4 text-sm text-white/82">
              B2B support, quotation follow-up and direct sales assistance are handled
              here.
              </div>
            </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-[#0e2f56]">Support hours</h2>
            <div className="mt-4 space-y-3 text-sm text-black/65">
              <div className="flex justify-between gap-4"><span>Sunday - Thursday</span><span>10:00 AM - 7:00 PM</span></div>
              <div className="flex justify-between gap-4"><span>Friday</span><span>Closed</span></div>
              <div className="flex justify-between gap-4"><span>Saturday</span><span>10:00 AM - 5:00 PM</span></div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
